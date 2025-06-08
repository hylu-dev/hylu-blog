---

title: "Creating Volumetric Fog of War"
date: 2025-06-07T22:38:56-04:00
draft: false
cover:
    image: "fog-cover.gif"
badges:
    - icon: "unity"
    - icon: "csharp"
    - icon: "hlsl"
tags: ["development", "unity", "c#", "shaders"]
math: true

---

## Volumetric Fog of War

While working on *Inner Alliance*, we needed a fog of war system to obscure vision ranges. Initially, I explored 2D solutions since the game is top-down. However, due to dynamic camera angles that show side perspectives, I opted for a volumetric fog approach.

---

## Fog Shading Techniques

Without lighting, the fog appears flat.

### Texture Shading

My first approach was to simulate realistic lighting by raymarching from the camera and calculating how light scattered through the fog. While visually accurate, it was far too heavy on the GPU and had to be scrapped.

I then experimented with layering simplex noise twice:

- First to add texture to the fog density.
- Then to overlay a secondary color, simulating shadowing.

This created a more stylized look, but it ended up feeling too busy and unnatural for the scene.

{{< card src="fog-texture-shadows.gif" >}}
Fog rendered with texture-based shadows.
{{</ card >}}

### Rayleigh Scattering

Searching for better performance-quality balance, I came across an [Acerola video](https://www.youtube.com/watch?v=ryB8hT5TMSg) using **Rayleigh Scattering**. While it's often used with light ray sampling, I used **single scattering** for a lightweight yet visually pleasing effect. It reacts to the main light’s direction and color.

```cpp
float RayleighScattering(float3 cameraRay, float3 lightDirection)
{
    float3 lightVector = -lightDirection;
    float3 worldUp = float3(0, 1, 0);

    float lightHeightInfluence = saturate(dot(lightVector, worldUp));
    float cosineAngle = saturate(dot(normalize(cameraRay), normalize(lightDirection)));
    float intensityMultiplier = pow(lightHeightInfluence, 0.5);

    return THREESIXTEENTHPI * (1 + cosineAngle * cosineAngle) * intensityMultiplier;
}
```

$$
I(\theta) \propto (1 + \cos^2\theta)
$$

- \\(I(\theta)\\): The brightness of the scattered light you see.
- \\(\propto\\): Means "is proportional to," showing the brightness changes with the equation.
- \\(\cos\theta\\): How the angle between the incoming light and your view affects the light's brightness.

{{< card src="fog-rayleigh.gif" >}}
Fog rendered with Rayleigh Scattering.
{{</ card >}}

---

## Setting Up the Post-Processing Pipeline

Volumetric fog is usually rendered via **raymarching**. To enable this in Unity URP:

1. **Set up a post-process pipeline.**
2. **Pass required data:** depth texture and view-projection matrix (to reconstruct world positions in the shader).

{{< card src="depth-to-world-space.png" >}}
Reconstructed world-space positions as RGB.
{{</ card >}}

{{< tiles type="md" >}}

```cpp
float3 GetWorldPosition(float2 uv, float depth)
{
    float4 clipPos = float4(uv * 2.0 - 1.0, depth, 1.0);
    clipPos.y = -clipPos.y;
    float4 worldPos = mul(_InverseViewProjection, clipPos);
    return worldPos.xyz / worldPos.w;
}
```

- Converts screen-space UV and depth into world-space coordinates.
- Uses the inverse view-projection matrix to reconstruct 3D positions.

{{< /tiles >}}

In the render pass, we:

- Compute and pass the camera's view-projection matrix.
- Use a **temporary texture** to avoid read-write conflicts on the camera buffer.
- Perform a two-step blit: camera → temp → camera.

```csharp
// FogPostProcessRenderPass.cs
public override void RecordRenderGraph(RenderGraph renderGraph, ContextContainer frameData)
{
    ...
    // Compute matrices
    Matrix4x4 viewProj = GL.GetGPUProjectionMatrix(camera.projectionMatrix, true) * camera.worldToCameraMatrix;

    var tempTextureDesc = new TextureDesc(cameraData.cameraTargetDescriptor) {
        depthBufferBits = 0, name = "FogTempTexture"
    };
    TextureHandle tempTexture = renderGraph.CreateTexture(tempTextureDesc);

    // Pass 1: Render fog into temp texture
    using (var builder = renderGraph.AddRasterRenderPass<FogPassData>(ProfilerTag + "_ToTemp", out var passData))
    {
        ...
        builder.SetRenderFunc((data, rgContext) => {
            var cmd = rgContext.cmd;
            cmd.SetGlobalMatrix(InverseViewProjectionID, data.InverseViewProjection);
            cmd.SetGlobalVector(CameraPosID, data.CameraPos);
            Blitter.BlitTexture(cmd, data.Source, new Vector4(1, 1, 0, 0), data.Material, 0);
        });
    }

    // Pass 2: Copy back to camera
    using (var builder = renderGraph.AddRasterRenderPass<CopyPassData>(ProfilerTag + "_ToCamera", out var passData))
    {
        ...
        builder.SetRenderFunc((data, rgContext) => {
            Blitter.BlitTexture(rgContext.cmd, data.Source, new Vector4(1, 1, 0, 0), 0, true);
        });
    }
}
```

**Note:** Don't blit directly to the source texture; use a temp buffer to avoid undefined behavior.

> ["Avoid setting source and dest to the same render texture..."](https://docs.unity3d.com/ScriptReference/Graphics.Blit.html)

---

## Fixing Raymarch Step Transitions

Banding artifacts appear due to fixed raymarch step sizes. To mitigate this:

- Offset the starting point of each ray using noise (e.g., Perlin or blue noise).

{{< tiles >}}
{{< card src="fog-banding.png" >}}
Raymarch banding visible.
{{</ card >}}

{{< card src="fog-banding-noise.png" >}}
Banding reduced with noise offset.
{{</ card >}}
{{</ tiles >}}

---

## Voxel-Based Fog: Lessons Learned

My first approach used voxel data (from existing scene voxelization) for fog.

- Passed voxel grid as a structured buffer.
- Did ray-box intersection per voxel.
- Rendered fog on voxel-bound geometry.

It looked promising but:

- Performance suffered due to per-voxel intersections.
- Fog coverage was limited to voxel bounds.
- Scaling fog density worsened performance.

{{< card src="fog-voxel-based.png" >}}
Voxel-based volumetric fog (ray-box intersection).
{{</ card >}}

Ultimately, a screen-space raymarch was simpler and more performant for our needs.

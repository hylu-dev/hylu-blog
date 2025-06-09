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

While I was working on *Inner Alliance*, we wanted to implement a fog of war but we realized a simple 2D screen effect wouldn't cut it when we had a dynamic 3D camera. That led me down the path of raymarched fog. Here, we'll take a look at how I built it in Unity URP.

---

## Fog Shading Approaches

### Texture-Based Shadows

I started by layering simplex noise for both density and “fake” shadowing. Imagine two wispy noise textures overlapping to give depth.

```hlsl
// Sample shader snippet for texture-based fog
float noiseDensity = snoise(worldPos * densityScale);
float shadowMask  = snoise(worldPos * shadowScale);
float fogAmount   = smoothstep(minDist, maxDist, length(rayDir)) * noiseDensity;
Color             *= fogAmount * (1 - shadowMask);
```

{{< card src="fog-texture-shadows.gif" >}}
Fog rendered with texture-driven shadows—stylized but quite noisy.
{{< /card >}}

In practice, the look was interesting but too busy: the scene felt like it was pulsing rather than smoothly fading. Performance was good since I could just encode multiple noise textures onto multiple channels in the texture so it only required a single sample per fragment.

### Rayleigh Scattering (Single-Scattering)

Next, I found a way to mimic light scattering a video by [Acerola](https://www.youtube.com/watch?v=ryB8hT5TMSg). We calculate light scattering based on the angle between your view ray and the main light along with some constants.

```hlsl
float RayleighScattering(float3 cameraRay, float3 lightDir)
{
    float3 up             = float3(0, 1, 0);
    float heightInfluence = saturate(dot(-lightDir, up));
    float cosAngle        = saturate(dot(normalize(cameraRay), normalize(lightDir)));
    float intensity       = pow(heightInfluence, 0.5) * (1 + cosAngle * cosAngle);
    return THREESIXTEENTHPI * intensity;
}
```

$$
I(\theta) \propto 1 + \cos^2\theta
$$

{{< card src="fog-rayleigh.gif" >}}
Fog rendered with Rayleigh scattering. More natural and reacts to scene lighting.
{{< /card >}}

---

## Building the URP Post-Processing Pass

To get volumetric fog working, we need two things: depth data and a custom render pass.

1. **Enable Depth Texture** in your URP asset settings.
2. **Reconstruct World Positions** in the shader:

```hlsl
float3 GetWorldPosition(float2 uv, float depth)
{
    float4 clip = float4(uv * 2 - 1, depth, 1);
    clip.y    = -clip.y;
    float4 world = mul(_InverseVP, clip);
    return world.xyz / world.w;
}
```

### Render Graph Workflow

1. Calculate the camera view-projection matrix and pass into the shader
2. **Pass 1:** Raymarch fog into a temporary texture.  
3. **Pass 2:** Blit the result back to the camera target.

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

> **Tip:** Always double buffer to a temporary texture first—writing directly to the camera buffer can lead to [race conditions](https://docs.unity3d.com/ScriptReference/Graphics.Blit.html).

---

## Tackling Raymarch Banding

Raymarching with constant steps can leave noticeable bands. Our fix: jitter the start of each ray with blue noise.

{{< tiles >}}
{{< card src="fog-banding.png" >}}
Notice the straight, uniform bands—definitely not what you want.
{{< /card >}}

{{< card src="fog-banding-noise.png" >}}
After adding a small noise offset, the bands smoothed out into a natural gradient.
{{< /card >}}
{{< /tiles >}}

---

## Why We Skipped Voxel-Based Fog

We tried using our scene’s voxel grid to intersect rays against. It looked neat, but:

- **Performance:** Per-voxel intersection kills the GPU.  
- **Limits:** Fog didn’t extend beyond the voxelized bounds.  
- **Scalability:** Cranking up density made things crawl.

{{< card src="fog-voxel-based.png" >}}
Voxel-based volumetric fog using ray-box intersections—cool proof of concept, but too slow for real-time.
{{< /card >}}

Ultimately, screen-space raymarching offered full-screen coverage and much smoother performance.

---

## Wrapping Up

Volumetric fog of war adds a layer of immersion, but only if it doesn’t tank your frame rate. By combining single-scattering Rayleigh, a URP render graph, and noise-baked optimizations, you get a flexible system that stays lean. Give it a try and tweak the balance between density, scattering, and noise to fit your game’s style!

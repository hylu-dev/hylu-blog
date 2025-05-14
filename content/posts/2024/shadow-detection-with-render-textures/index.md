---
title: "Shadow Detection: Why Render Textures Were a Mistake"
date: 2024-10-28T21:32:19-04:00
draft: false
cover:
    image: "shadow-map.gif"
tags: ["unity", "shaders", "graphics"]
socialIcons:
    - name: "itchio"
      url: "https://teamnightcreature.itch.io/luciddream"
---

During a game jam centered around the theme of light, I worked on a project that required a shadow detection system. You can check out the game [here](https://teamnightcreature.itch.io/luciddream). 

> The challenge was to detect when objects were in light or shadow and identify the closest shadow to an object.

Initially, I thought render textures would be an elegant solution, **but this approach turned out to be a mistake. Here's why**.

## The Initial Appeal of Render Textures

The idea was to use a camera positioned above the scene to capture light and shadow data into a render texture. This texture could then be sampled to determine if an object was in shadow or to find the nearest shadow by analyzing surrounding pixels. It seemed promising because it provided a dynamic map of the environment, avoiding the performance cost of casting multiple rays while also letting us easily find the closest shadow.

{{< tiles >}}
    {{< card src="shadow-shader.gif">}}
        The scene is rendered with a replacement shader to posterize light and shadow into black and white.
    {{</ card >}}
    {{< card src="closest-shadow.gif">}}
        A cylinder samples the render texture to locate the closest dark pixel.
    {{</ card >}}
{{</ tiles>}}

## Why Render Textures Failed

Despite the initial optimism, the render texture approach had significant flaws:

1. **Performance Overhead**: Generating and sampling render textures consumed substantial resources, causing frame rate drops, especially on lower-end hardware.
2. **Complexity**: Managing render textures added layers of complexity to the rendering pipeline, making it harder to debug and maintain.
3. **Inaccurate Shadow Calculations**: Shadows for additional lights were unreliable due to issues with Unity’s shadow map accessors. Misaligned shadow data led to artifacts and incorrect mappings.
4. **Light Layer Challenges**: Encoding lights into RGB channels for selective light interactions required switching to unlit shaders and manual light calculations. This introduced additional complexity and still didn’t fully resolve shadow inaccuracies.
5. **Design Changes**: Finding the *closest shadow* turned out also being too much of a design challenge so we didn't end up using this feature.

{{< card src="light-layers.png">}}
    Lights were encoded in RGB based on their layer, but shadow artifacts and incorrect mappings persisted.
{{</ card >}}

## The Shader Attempt

To address selective light interactions, I used unlit shaders to manually calculate lighting and encode light layers into RGB channels. Below is the core fragment shader used:

```cpp
// LightShadowRGBLayerEncoded.shader

half4 PosterizeToRGB(half3 color, half threshold)
{
    return half4(1-step(color, threshold), 1.0);
}

half4 frag(Varyings IN) : SV_Target
{
    // Initialize color to black
    half3 finalColor = 0;

    // Calculate diffuse lighting from the main light
    Light mainLight = GetMainLight(IN.shadowCoords);
    float diffMain = max(dot(IN.normalWS, mainLight.direction), 0.0);
    finalColor += diffMain * mainLight.color * mainLight.shadowAttenuation;

    // Calculate lighting from additional lights
    int additionalLightsCount = GetAdditionalLightsCount();
    for (int i = 0; i < additionalLightsCount; i++)
    {
        Light l = GetAdditionalLight(i, IN.positionWS);
        float diffuse = max(dot(IN.normalWS, l.direction), 0.0);
        float shadowAmount = AdditionalLightRealtimeShadow(i, IN.positionWS, l.direction);

        half3 lightColor = 
            (l.layerMask & 0x1) != 0 ? half3(1, 0, 0) : // Red for Layer 0
            (l.layerMask & 0x2) != 0 ? half3(0, 1, 0) : // Green for Layer 1
            (l.layerMask & 0x4) != 0 ? half3(0, 0, 1) : // Blue for Layer 2
            half3(0, 0, 0); // Default color black

        // Disable shadows due to alignment issues
        shadowAmount = 1.0;
        finalColor += diffuse * lightColor * l.distanceAttenuation * shadowAmount;
        finalColor = saturate(finalColor);  
    }

    // Posterize the color to 1 and 0
    return PosterizeToRGB(finalColor, _Threshold);
}
```

## Lessons Learned

The render texture approach was a poor fit for shadow detection. It introduced performance bottlenecks, unreliable results, and excessive complexity. A simpler solution, such as optimized raycasting or leveraging Unity’s built-in shadow maps more effectively, would likely have been more efficient and reliable.

## Moving Forward

There may be potential in this method we needed to find the closest shadow but for this project, it ended up being a big time sink with lack luster results.

If I were to come back to this method, I'd implement the following improvements.

- Shadow Map Sampling: Directly sample Unity’s shadow maps with proper alignment to avoid artifacts.
- Compute Shaders: Offload shadow detection to compute shaders for better performance in complex scenes.
- Spatial Paritioning: Optimize searching for the closest shadow in partitions rather than trying to read all the pixels.

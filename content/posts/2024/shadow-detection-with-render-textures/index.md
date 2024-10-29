---
title: "Shadow Detection With Render Textures"
date: 2024-10-28T21:32:19-04:00
draft: false
cover:
    image: "shadow-map.gif"
tags: ["unity", "shaders", "graphics"]
socialIcons:
    - name: "itchio"
      url: "https://teamnightcreature.itch.io/luciddream"
---

I participated in a game jam where we worked on game with the theme surrounding light. If you're interested, you can check out [here](https://teamnightcreature.itch.io/luciddream).

For now, I want to focus on the shadow detection system I developed for the project. The designers originally came to me with the challenge of detecting when something is an light and shadow. That by itself would seem easy enough with some careful usage of raycasts. However it was the second requirement that made things complicated.

> Detecting where the closest shadow would be.

This gets complicated as you need some sense of the space around the world, not just the targets that are receiving light. You might start thinking about shooting many rays in every direction but that becomes a massive performance hit, especially if you have lot's a objects calculating at the same time. The solution I came to was to use render textures.

## Mapping the World in a Texture

The idea is, you place another camera above the world and have it capture just the light and shadow data and write that to a texture buffer. Then, whenever you need to figure out whether something is in shadow, you can just sample the world position and project that onto that texture.

Then for finding the closest shadow, since we now have data about the environment, we can map that to any position on the direction and sample around it to find the closest shadow. This is admittedly an expensive operation but there are solutions.

{{< tiles >}}
    {{< card src="shadow-shader.gif">}}
        The scene is rendered with a blank replacement material so colors don't affect the shadow. It's then posterized into black and white
    {{</ card >}}
    {{< card src="closest-shadow.gif">}}
        The cylinder looks for the closest dark pixel based on its location
    {{</ card >}}
{{</ tiles>}}

{{< card src="shadow-map.gif">}}
    The replacement shader also does some light reweighting so the actual brightness doesn't affect the range. I needed to use a wider color format in order to reweight accurately enough.
{{</ card >}}

## Solving Selective Light Interactions

The problem with the system at this point is that all lighting is treated the same. There is no sense of which light is which and no way to ignore some lights while listening for others.

A solution that I came up with is to encode the lights in RGB depending on what layer they're on and write that onto the render texture instead of just plain white for every light. The issue now is that so far, I've been using URP **lit shaders** to render the light shadows and just reweighting the colors until I got a *correct* enough map. 
I need to make use of several URP libraries to get per-lighting info in code so that leaves my with **unlit shaders** where I have to calculate lighting manually.

Below you can see the main portion of the shader which does all the light and shadow calculation using the needed URP functions. For light layers, I pull the data off of the `Light` struct for both the directional and additional lights.

```cpp
// LightShadowRGBLayerEncoded.shader

...

half4 PosterizeToRGB(half3 color, half threshold)
{
    return half4(1-step(color, threshold), 1.0);
}

half4 frag(Varyings IN) : SV_Target
{
    // Initialize color to black
    half3 finalColor = 0;

    // Calculate diffuse lighting contribution from the main light
    Light mainLight = GetMainLight(IN.shadowCoords);
    float diffMain = max(dot(IN.normalWS, mainLight.direction), 0.0);
    finalColor += diffMain * mainLight.color * mainLight.shadowAttenuation;

    // Calculate lighting contributions from additional lights
    int additionalLightsCount = GetAdditionalLightsCount();
    for (int i = 0; i < additionalLightsCount; i++)
    {
        // Check if pointlight (1.0) or spotlight (0.0)
        Light l = GetAdditionalLight(i, IN.positionWS);

        float diffuse = max(dot(IN.normalWS, l.direction), 0.0);
        float shadowAmount = AdditionalLightRealtimeShadow(i, IN.positionWS, l.direction);

        half3 lightColor = 
            (l.layerMask & 0x1) != 0 ? half3(1, 0, 0) : // Red for Layer 0
            (l.layerMask & 0x2) != 0 ? half3(0, 1, 0) : // Green for Layer 1
            (l.layerMask & 0x4) != 0 ? half3(0, 0, 1) : // Blue for Layer 2
            half3(0, 0, 0); // Default color black

        // Disable shadows for now
        shadowAmount = 1.0;
        finalColor += diffuse * lightColor * l.distanceAttenuation * shadowAmount;
        finalColor = saturate(finalColor);  
    }

    // Posterize the color to 1 and 0
    return PosterizeToRGB(finalColor, _Threshold);
}
```

> There's a great benefit to manual light calculations as I can be certain of the color values being rendered unlike using lit shaders where I had to do rough constraining of Unity's rendered colors. I also save on computation because I can optimize the lighting calculations to the bare minimum instead of everything a PBR shader does.

{{< card src="light-layers.png">}}
    Light are encoded in RGB based on the layer they are in. If you look closely at the shadows, you can see incorrect mapping and artifacts.
{{</ card >}}

I ran into an issue trying to calculate shadows for additional lights. While Unity provides accessors for their shadows maps, I couldn't quite figure out why they weren't lining up correctly. The functions internally do handling of shadow sampling slicing. Because the shadows weren't calculating correctly. In the end, I actually took out the shadows from this shader and used two render textures for sampling. The original one for shadow locations and this one for light layer mapping.
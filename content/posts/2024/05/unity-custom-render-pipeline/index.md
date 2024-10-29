---
title: "Unity Custom Passes with URP"
date: 2024-05-07T12:35:27-04:00
draft: false 
cover:
    image: "https://roystan.net/media/tutorials/toon-shader-demo.png"
tags: ["Unity", "Code"]
---

I'm documenting some of my adventures looking into the Scriptable Render Pipelines in Unity. I have the goal of creating a stylized 3D pixel-art render pipeline heavily inspired by [t3ssel8r](https://imgur.com/gallery/qwhbHQq).

## What is URP


## Cel-Shading




## Rendering To an Intermediate Texture

During rendering passes, it's common to store information by rendering to a texture instead of immediately rendering to the screen. For example, if you want to just do a pass to collect depth information, you can draw that information in memory and hold on to it to reference for later usage. You probably wouldn't want to draw normals on the screen directly and mess with the rest of your render passes.

In Unity you would use [`RenderTexture`](https://docs.unity3d.com/ScriptReference/RenderTexture.html) which is simply just a buffer that you can write texture information too.

```csharp
RenderTexture
```

Better yet you can use some higher-level abstractions like [`RTHandle`](https://docs.unity3d.com/Packages/com.unity.render-pipelines.core@17.0/api/UnityEngine.Rendering.RTHandle.html) which provides resolution management, memory pooling, and other improvements out of the box.

```csharp
RTHandle
```

## URP Lit Shaders

Reference: https://www.youtube.com/watch?v=E3i2eagy_eI

One of the challenges of URP shaders is that we don't have access to surface shaders. Surface shaders are designed to hook into Unity's lighting system and add an entry point for further shader calculations on top. Unfortunately for URP, the configurable rendering approach as well as support more advanced rendering features like PBR don't align well with the concept of surface shaders that are designed to abstract fixed rendering pipelines like BRP.

One solution is to use Shader Graph which Unity maintains nodes to get light information.

For scripts though, we'll have to stick with HLSL shaders and **do our lighting calculation manually**. Luckily, we're given access to a bunch more HLSL macros and functions that can help us perform calculations as well as get information like light positions.

https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.0/manual/writing-shaders-urp-basic-unlit-structure.html
https://docs.unity3d.com/Manual/SL-UnityShaderVariables.html

https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.0/manual/use-built-in-shader-methods-shadows.html

### Unlit Shader Template in URP

The usual template you want to start with for HLSL shaders in Unity is the **Unlit Shader**. The annoying part is the template has a lot of unnecessary boilerplate and old references. For example, it comes baked with LOD and Fog calculations that you often end up deleting. As well as old **CG** references like `#include "UnityCG.cginc"` using methods from it like `UnityObjectToClipPos()`. 

> `UnityCG.cginc` is one of a few [standard helper scripts](https://docs.unity3d.com/Manual/SL-BuiltinIncludes.html) available to include. Some of these scripts like `Lighting.cginc` are only compatibile with BRP but the scripts can largely be useful across any pipeline.  I

URP comes with more hlsl scripts that provide comparable methods to the cginc scripts such as the one's in `SpaceTransforms.hlsl`. When you start including other URP shader scripts, you'll find they conflict with with the cginc counterparts, leading to you having to removing any references to it anyway. Some of these scripts include:

- Core.hlsl
- SpaceTransforms.hlsl
- Lighting.hlsl
- Input.hlsl

> In any URP project, you can find these files by searching inside the Packages folder

## Pipeline Overview

When a scene is rendered to the screen, it's done using a series of passes that incrementally draw each part of the scene such as the geometry, the shadows, the post-processing effects, etc.

## Forward Rendering

By default, Unity 

## G-Buffer

It's a buffer that stores per-pixel information about the geometry in the scene.
The typical components stored in a G-buffer include:

- Position: Stores the world-space position of each pixel.
- Normal: Stores the surface normal vector at each pixel.
- Albedo: Stores the base color of the surface at each pixel.
- Specular: Stores material properties related to surface reflection or glossiness.
- Depth: Stores the depth information of each pixel.

This is typically used in deferred rendering so lighting calculations can all be done at once at the end using the G-buffer.

In forward rendering, every single pixel needs to calculate each light source which results in lot's of recalculations of positions, normals, albedo, etc. 
---
title: "Real Time Toon Shading in Unity"
date: 2024-05-12T00:12:51-04:00
draft: false
cover:
    image: ""
tags: ["Shaders", "Unity"]
---

# Toon Shading

We'll be using a numbers of methods from Unity's URP package by importing Lighting.hlsl. That file has some other inclusions that we will also make direct use of. In all, we'll be using the following files.

- Lighting.hlsl
- RealTimeLights.hlsl
- Shadows.hlsl
- SpaceTransforms.hlsl

Lighting.hlsl RealTimeLights.hlsl. In order to ensure our reacts to light in real-time, we need to hook on to some of Unity's lighting methods to acquire the lights in the scene as well as the shadow maps.

https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.0/manual/use-built-in-shader-methods-shadows.html

Phong reflection

{{< img src="https://learnopengl.com/img/advanced-lighting/advanced_lighting_halfway_vector.png">}}


> DepthTexture don't work with SSAO enabled in URP https://forum.unity.com/threads/depth-texture-doesnt-work-correctly-without-ssao.1555910/

> ShaderTagId https://forum.unity.com/threads/srp-relationship-between-drawrenderers-and-drawsettingss-shadertagid.674014/
---
title: "Basics of Shader Fractals"
date: 2023-07-13T20:53:06-04:00
draft: true
cover:
    image: ""
module: "js/script.js"
tags: ["shaders", "glsl"]
category: ["Development"]
---

Fractals are built off of a single pattern or formula, repeated constantly with smaller and smaller transformations. In glsl, this idea translates nicely into iterative coding with for loops.

First off, we can start by creating some base pattern that we want to design our fractal off of. In this case, we can start with a simple square.

{{< html >}}
<div id="three-container" style="display:block;height: 400px;width: 100%;"></div>

<script id="vertexShader" type="x-shader/x-vertex">
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
</script>

<script id="fragmentShader" type="x-shader/x-fragment">
    uniform vec2 resolution;
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 color = vec3(.2, .7, 1.);
        gl_FragColor = vec4(color, 1.0);
    }
</script>
{{</ html >}}
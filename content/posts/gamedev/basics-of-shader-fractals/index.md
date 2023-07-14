---
title: "Basics of Shader Fractals"
date: 2023-07-13T20:53:06-04:00
draft: true
cover:
    image: ""
three: true
math: true
tags: ["shaders", "glsl"]
category: ["Development"]
---

Fractals are built off of a single pattern or formula, repeated constantly with smaller and smaller transformations. In glsl, this idea translates nicely into iterative coding with for loops.

First off, we can start by creating some base pattern that we want to design our fractal off of. In this case, we can start with a simple square.

{{< tiles >}}
    {{< shader size=300 >}}
    {{</ shader >}}
    {{< shader size=300 >}}
    {{</ shader >}}
{{</ tiles>}}

{{< shader size=300 >}}
<script id="fragmentShader" class="fragmentShader"  type="x-shader/x-fragment">
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    uniform vec2 u_resolution;

    #define PI 3.1415926538
    #define TAU 6.2831855

    // Inigo Quilez
    vec3 palette( in float t )
    {
        vec3 a = vec3(.5);
        vec3 b = vec3(.5);
        vec3 c = vec3(1.);
        vec3 d = vec3(0.00, 0.33, 0.67);
        return a + b*cos( 6.28318*(c*t+d) );
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
        float global_dist = length(uv);
        vec4 color;

        float dist = length(uv);
        float angle = atan(uv.y*PI, uv.x*PI);
        float layer_offset = dist*2.*TAU;

        float waves = 1.-sin(dist*5.*TAU - u_time*3.);
        float umbrella = sin(angle*5. + u_time + layer_offset);

        color += vec4(vec3(umbrella), 1.);
        color += waves;

        color *= vec4(palette(global_dist+u_time*.1), 1.);
        color *= pow(color, vec4(1.2)); // Increase contrast

        gl_FragColor = color;
    }
</script>
{{</ shader >}}
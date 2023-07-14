---
title: "Basics of Shader Fractals"
date: 2023-07-13T20:53:06-04:00
draft: true
cover:
    image: ""
shader: true
math: true
tags: ["shaders", "glsl"]
category: ["Development"]
---

Fractals are built off of a single pattern or formula, repeated constantly with smaller and smaller transformations. In glsl, this idea translates nicely into iterative coding with for loops.

## How to Make a Fractal

I'll be following [kishimisu's guide](https://www.youtube.com/watch?v=f4s1h2YETNY) on shaders.

First off, we can start by creating some base patterns that we want to design our fractal off of. In this case, we can start with a simple circle.

```c
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    // center uv coordinate and normalize aspect ratio
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    vec3 color;

    float dist = length(uv);

    color = vec3(dist) - .5;
    color = abs(color);
    color = .1/color;
    color = pow(color, vec3(2.));

    gl_FragColor = vec4(color, 1.);
```

{{< shader size=300 >}}
<script class="fragmentShader" type="x-shader/x-fragment">
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    vec3 color;

    float dist = length(uv);

    color = vec3(dist) - .5;
    color = abs(color);
    color = .1/color;
    color = pow(color, vec3(2.));

    gl_FragColor = vec4(color, 1.);
}
</script>
{{</ shader >}}

We can then form out a pattern by setting the uv coordinates to it's fractional component.

```c
uv = fract(uv)*2.-1.;
```

{{< shader size=300 >}}
<script class="fragmentShader" type="x-shader/x-fragment">
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    vec3 color;
    uv = fract(uv)*2.-1.;

    float dist = length(uv);

    color = vec3(dist) - .5;
    color = abs(color);
    color = .1/color;
    color = pow(color, vec3(2.));

    gl_FragColor = vec4(color, 1.);
}
</script>
{{</ shader >}}

Here is where the fractal comes in. We can keep repeating this pattern for larger and larger uv coordinates by constantly iterating over it over our circle code. Additionally, we add our circle `color` to a `finalColor` variable so we get the result of every iteration on our canvas.

```c
    vec3 finalColor;
    for (float i = 0.; i < 3.; i++) {
        uv = fract(uv)*2.-1.;

        float dist = length(uv);
        color = .1/abs(vec3(dist) - .5);
        color = pow(color, vec3(2.));
        finalColor += color;
    }
    gl_FragColor = vec4(finalColor, 1.);
```

{{< shader size=300 >}}
<script class="fragmentShader" type="x-shader/x-fragment">
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec3 finalColor;
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    vec3 color;
    for (float i = 0.; i < 3.; i++) {
        uv = fract(uv)*2.-1.;
        float dist = length(uv);
        color = .1/abs(vec3(dist) - .5);
        color = pow(color, vec3(2.));
        finalColor += color;
    }

    gl_FragColor = vec4(finalColor, 1.);
}
</script>
{{</ shader >}}

## Start Experimenting

With this basis, you can continue to add to the fractal by **encorporating gradients, animating values, adding curves**, and **anything** at all really. The tiniest change can generate a wildy different fractal pattern and it's all about experimentation to get something you might like.

```c
uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.1415926538
#define TAU 6.2831855

// https://iquilezles.org/articles/palettes/
vec3 palette( in float t )
{
    vec3 a = vec3(.5);
    vec3 b = vec3(.5);
    vec3 c = vec3(1.);
    vec3 d = vec3(abs(.2*sin(u_time*.1)), abs(sin(u_time*.1)), 0.5);
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec3 color;
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    float dist;
    float global_dist = length(uv);
    vec3 final_color;

    for (float i = 0.; i < 3.; i++) {
        uv = fract(uv*1.5) - .5;

        dist = length(uv)*exp(-global_dist);
        color = palette(global_dist+u_time*.5);
        
        dist = .1*sin(dist*8. + u_time*2.);
        dist = abs(dist);
        dist = .01/dist;
        dist = pow(dist, 1.2);
        
        final_color += color*dist;
    }
    gl_FragColor = vec4(final_color, 1.);
}
```

{{< shader >}}
<script class="fragmentShader" type="x-shader/x-fragment">
uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.1415926538
#define TAU 6.2831855

// https://iquilezles.org/articles/palettes/
vec3 palette( in float t )
{
    vec3 a = vec3(.5);
    vec3 b = vec3(.5);
    vec3 c = vec3(1.);
    vec3 d = vec3(abs(.2*sin(u_time*.1)), abs(sin(u_time*.1)), 0.5);
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec3 color;
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    float dist;
    float global_dist = length(uv);
    vec3 final_color;

    for (float i = 0.; i < 3.; i++) {
        uv = fract(uv*1.5) - .5;

        dist = length(uv)*exp(-global_dist);
        color = palette(global_dist+u_time*.5);
        
        dist = .1*sin(dist*8. + u_time*2.);
        dist = abs(dist);
        dist = .01/dist;
        dist = pow(dist, 1.2);
        
        final_color += color*dist;
    }
    gl_FragColor = vec4(final_color, 1.);
}
</script>
{{</ shader >}}

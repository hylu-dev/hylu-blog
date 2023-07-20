---
title: "Some More GLSL"
date: 2023-07-19T03:43:21-04:00
draft: false
cover:
    image: "https://thebookofshaders.com/04/glslGallery.gif"
tags: ["glsl"]
---

## Vertex Shaders

So far, I've been primarily writing 2D shaders to create patterns on a flat canvas. In practice, **shaders can also be applied to 3D objects** to manipulate not only their textures but also their shape.

To start, let's take a look at a simple 2D shader placed on a 3D cube.

{{< tiles >}}
    {{< shader size="300" >}}
        <script class="fragment-file" type="x-shader/x-fragment">
        shaders/random.frag
        </script>
        {{</ shader >}}
        
        {{< shader size="300" mode="3DR" >}}
        <script class="fragment-file" type="x-shader/x-fragment">
        shaders/random.frag
        </script>
    {{</ shader >}}
{{</ tiles >}}

Notice that the texture remains flat but is effectively cropped onto the projection of the cube. Ideally, we'd like the texture to wrap over the cube instead.

### Shaders With Normals

Normals refer to vector data stored at each vertice of a mesh. The vector points perpendicular from the mesh and gives us information on **which way this vertice is facing**. We can use this information to make sure our shader gets properly transformed onto each side of the shape instead of covering its profile.

## Timing Functions

It's easy to add moving parts to a shader by including a `u_time` term. However, if you want more interesting motion, you should be interested in adding shapes and curves using functions.

### Slope Step

This was my first implementation of a start and stop timing function. It's very close to working but has a fatal flaw.

```c
float slope_step(float x) {
    float c = .5*floor(x)*ceil(sin(x*PI));
    float b = .5*floor(x+1.)*ceil(sin(x*PI-PI));
    float a = x*ceil(sin(x*PI))-floor(x)*ceil(sin(x*PI));
    return a + b + c;
}
```

> <https://www.desmos.com/calculator/zj8mjz9tos>

{{< tiles >}}
{{< html >}}
    <iframe src="https://www.desmos.com/calculator/i5gzs0ba8p?embed" width="300" height="300"></iframe>
{{</ html >}}

{{< shader size="300" >}}
<script class="fragment-shader" type="x-shader/x-fragment">
uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.1415926538

float slope_step(float x) {
    float c = .5*floor(x)*ceil(sin(x*PI));
    float b = .5*floor(x+1.)*ceil(sin(x*PI-PI));
    float a = x*ceil(sin(x*PI))-floor(x)*ceil(sin(x*PI));
    return a + b + c;
}

void main() {
    vec3 color;
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    uv += slope_step(u_time);
    uv = fract(uv*5.);

    float shape = smoothstep(-.05, -.01, uv.x) -
     smoothstep(.01, .05, uv.x) +
     smoothstep(-.05, -.01, uv.y) -
     smoothstep(.01, .05, uv.y);

    color = vec3(shape);
    gl_FragColor = vec4(color, 1.);
}
</script>
{{</ shader >}}
{{</ tiles >}}

Notice the occasional shader flickering. Because we need to hardcode in a value for `PI`, the imprecision causes our sine waves to not line up where we need them to and returning unexpected values at those junctures.

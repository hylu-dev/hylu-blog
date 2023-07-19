---
title: "Some More GLSL"
date: 2023-07-19T03:43:21-04:00
draft: false
shader: true
cover:
    image: "https://thebookofshaders.com/04/glslGallery.gif"
tags: ["glsl"]
---

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
<iframe src="https://www.desmos.com/calculator/i5gzs0ba8p?embed" width="300" height="300" ></iframe>
{{</ html >}}

{{< shader size="300" >}}
<script class="fragmentShader" type="x-shader/x-fragment">
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

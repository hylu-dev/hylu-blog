---
title: "Layering Colours"
date: 2023-08-26T12:23:27-04:00
draft: false
cover:
    image: ""
tags: ["glsl"]
---

Hey, yep I'm back already with more mental pain.

I've been working on putting together a layered parallax scene as per <https://www.youtube.com/watch?v=XaiYKkxvrFM>.

I'm a good ways there writing most of the code on my own. I've made series of repeating trees across a sloping hill and it's time for me to start layering them on top with a for loop.

In the tutorial, he wrote all of the shape functions to return `vec4` so they include the alpha channel in addition to the colours.

In my code, I wanted to keep the shape functions simple so I left them as returning a float of 1 for pixels in the shape and zero elsewhere (plus blur).

I first started off by adding the layers on top of eachother directly but I realized that that wasn't going to work because despite the fact I was hardcoding `1.0` into the alpha channel, the layers in front were still going to mix with the colours behind it.

If I want to make the layers in the front darker, then when I add the layer on top of a light layer, it's just going to inherit the colours below it. This is not the way.

Instead, if I want to add a layer and replace the colour of whatever is underneath, then the best option turns out to be `mix()`.

Typically, you would use `mix()` to smoothly interpolate between two values based on a value `x` between 1 and 0. Since we just want to pick one of the two colours, we can mix the colour with the canvas and use `1` in areas of the layer to replace what's under and use `0` for areas outside the layer keep what was on the canvas the same.

```c
for (float i=0.; i<1.; i+=1./10.) {
    float scale = mix(30., 1., i);
    float layer = float(layer(uv*scale+vec2(t+i*100., i)-m));
    float alpha = layer;
    layer *= (1.-i); // darkens front layers
    color = mix(color, vec4(layer), alpha);
}
```

{{< shader >}}
<script class="fragment-file" type="x-shader/x-fragment">
shaders/scene.frag
</script>
{{</ shader >}}
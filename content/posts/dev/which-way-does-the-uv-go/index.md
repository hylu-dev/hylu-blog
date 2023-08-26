---
title: "Which Way Does the UV Go?"
date: 2023-08-25T23:35:31-04:00
draft: false
cover:
    image: ""
tags: ["glsl"]
---

While I was working on writing simple shape patterns in GLSL, I ended up with an interesting conundrum.

I fell into the pattern of creating shapes by closing in each side of the shape with a smoothstep in the following form.

```c
smoothstep(-blur, +blur, uv.x);
```

In this case, this creates a vertical edge where the left side is `0` and the right side is `1`. I then do the same thing for the rest of the side of the shape, until I enclose it so that all values inside the shape are `1` and everywhere else remains `0`. For example, a square.

```c
float square(vec2 uv, float width, float height) {
    float blur = .005;
    float shape = smoothstep(-blur, +blur, uv.x);
    shape *= 1.-smoothstep(-blur, +blur, uv.x-width);
    shape *= smoothstep(-blur, +blur, uv.y);
    shape *= 1.-smoothstep(-blur, +blur, uv.y-height);
    return shape;
}
```

## UV Flipping Problem

This works great and the syntax is clean. The only issue is that typically, shape translation are done through adding or subtracting from the `uv` directly. But with this syntax, the effect is reversed.

For example, let's say I wanted to draw a square, shifted `0.5` up and to the right. I'd intuitively draw one like this.

```c
square(uv + vec2(0.5, 0.5), .2, .2);
```

The problem is that this actually shifts it down and to the left, the opposite way! The issue with binding the interpolated value with the uv, is that the edge moves in the opposite directions that the uv are moved. Of course, you can just subtract instead for a slightly more meaningful signs.

```c
square(uv - vec2(0.5, 0.5), .2, .2);
```

But intuitively, you'd think adding a to the uv would shift the coordinates positively and therefore translate anything drawn on it positively.
This isn't a functional problem but something about it not following expectations makes me want to find another solution.

## An Alternative

If I want to achieve the shape without flipping the UV's, then you could do away with influencing the UV and just add a position argument like this

```c
float square(vec2 uv, vec2 pos, float width, float height) {

    vec2 s = step(pos, uv);
    float blur = 0.05;
    s = smoothstep(pos, pos+blur, uv);
    s *= smoothstep(uv-width, uv-width+blur, pos);

    return s.x*s.y;
}
```

And then now you can sub in the position vector instead.

Frankly, this even worse lol. It's adds unnecessary verbosity with the additional argument just to solve a trivial issue.

## Rethinking the first solution

Okay after all that, maybe it's worth rethinking the intuition of the original solution.

```c
float shape = smoothstep(-blur, +blur, uv.x);
```

So this line makes use of smoothstep to create an edge of white and black. Remember that smoothstep has you choose an upper and lower edge and then a value to interpolate between the two. In our case, it's really just a single edge since we just want to blur. So then the edge will occur at the time that `uv.x = blur`. If we subtract from the `uv`, then that means we need a higher `uv.x` value before we hit that edge, effectively moving the edge to the right. Remember, we're not subtracting the edge, that remains the same, we are subtracting the interpolater.

Thinking about it this way is much nicer but I can't deny I'm a wee bit unsatisfied. I'd still like the semantic understanding to be that we move the coordinates axes and the shape follows exactly but I guess that just won't be the case if we use the `uv` as the interpolator.

In my mind, I thought the shapes were being bound to the `uv` but they're really bound to the axes and the `uv` is just a the guy trying to find where 0 is and we're just messing with him.

This is very rambly but I've now accepted the reality of manipulating uvs, time to back to coding.

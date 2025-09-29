---
title: "Making a Live WebGPU Shader Editor"
date: 2025-09-29T12:23:34-04:00
draft: false
cover:
    image: ""
tags: ["wgpu", "shaders"]
socialIcons:
    - name: "github"
      url: "https://github.com/hylu-dev/wgsl-fragment-editor"
---

This is a continuation from my previous post about [Learning Rust and WebGPU](/posts/2025/learning-rust-and-webgpu/).

---

As I've been working through the WebGPU and Rust tutorials, I reached the point where I could render triangles onto a canvas and experiment with custom shaders. This inspired me to take a small detour and build a live code editor for `wgsl` (WebGPU Shading Language).

Previously, I created a live GLSL shader editor using `three.js` ([Basics of Shader Fractals](/posts/2023/old/dev/basics-of-shader-fractals/)). That approach involved loading the entire `three.js` library and setting up a camera to render onto a plane. While it worked, it felt unnecessarily heavy and a bit convoluted for the simple task of live shader editing.

This time, I wanted a cleaner, more lightweight solution—something purpose-built for experimenting with fragment shaders in the browser.

Most of the challenge was in figuring out the right bindings and compilation setup. Initially, I tried using the native Rust `wgpu` package, but I quickly realized this wasn't ideal for a web-based editor. Bundling the entire graphics layer resulted in a WebAssembly module around 2 megabytes in size—not terrible, but far from optimal for a simple shader playground. In hindsight, it makes much more sense to use the JavaScript WebGPU bindings and rely on the browser's native implementation.

There may be cases in the future where the extra control from using Rust and `wgpu` directly could be beneficial for performance or advanced features. But for now, the added complexity and overhead just aren't worth it for this use case.

Because of these considerations, I haven't integrated the editor directly into my site yet—I'll likely do a rewrite using the JS bindings first and perhaps also some more vertex shading support. In the meantime, you can try out the current version here:

<https://hylu-dev.github.io/wgsl-fragment-editor/>
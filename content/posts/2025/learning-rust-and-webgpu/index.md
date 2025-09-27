---
title: "Learning Rust and WebGPU"
date: 2025-09-26T23:21:03-04:00
draft: true
cover:
    image: ""
tags: ["rust", "graphics"]
---

I've looking at getting more into graphics programming. So I've mostly worked within game engines and dabbled a bit in **OpenGL**.

## Why Choose WebGPU?

- **Vulkan**
    - Super modern and powerful, but the API is really verbose and has a pretty steep learning curve. You get amazing performance and control though.
- **DirectX 12**
    - The go-to for Windows stuff; modern and fast with lots of low-level control, but it's Windows-only (though DirectX 11 is still pretty common).
- **OpenGL/WebGL**
    - Been around forever and works everywhere, but has a lot more CPU overhead and lacks modern graphics features.
    - No native computer shaders.
- **Metal**
    - Apple's graphics. Super powerful and simpler syntax but I don't got a Mac.
- **WebGPU**
    - A bit higher level as it maps to modern API's like Vulkan and Metal. Simpler syntax to get started.
    - Still offers modern features and great performance versus WebGL.
    - Great multi-platform targetting and easily runs in the browser. Will be nice for sharing project!
    - Some good documentation exists luckily but not nearly as much as some of the more mature options.

## C++ or Rust?
I had to decide between using **C++** with Google's Dawn implementation or **Rust** with the `wgpu` crate for my WebGPU journey.

**C++ with Dawn:**
- Dawn is Google's native WebGPU implementation, so it's the "reference" implementation
- More mature with extensive documentation and examples
- Familiar territory since I've used C++ before
- Direct access to the latest WebGPU features as they're developed

**Rust with wgpu:**
- Rust is really valued for it's memory safety. It's too valuable for me at the moment but will good to learn.
- Cargo toolchain is really great with the `wgpu` crate getting a lot of love.
- Still gets new WebGPU features pretty quickly, just slightly behind Dawn

I went with Rust as I figured it'd be a good chance to learn it. Also, the cargo build system and package management reminds me a lot of npm which I'm really enjoying. Definitely prefer it over having to bother with Makefiles/CMake.

## Getting Started with Rust

Before I jump into WebGPU, I figured I should at least try a bit of Rust and WASM with a quick todo app. First thing I noticed is that inherently composition based API over inheritance. I've been so used to classes so it's a change of pace.

First surprise was learning about the separation of definition from implementation with `struct` and `impl`.
And then the introduction of traits as a ways of extension.

The lead feature is of course the borrow checker. I know I haven't even scratched the surface of what it does but at least for this app, it reminds me a lot of smart pointer ownership in `C++` (though I later learned `Rust` has smart pointer as well).

For the todo app itself, I kept the implementation straightforward:

```rs
pub struct TodoList {
    name: String,
    todo: Vec<Todo>,
}

pub struct Todo {
    text: String,
    done: bool,
}

impl TodoList {
    pub fn new(name: &str) -> TodoList {
        Self {
            name: name.to_string(),
            todos: Vec::new(),
        }
    }

    pub fn add(&mut self, todo: Todo) {
        self.todos.push(todo);
    }
}

impl Todo {
    pub fn new(text: &str) -> Todo {
        Self {
            text: text.to_string(),
            done: false,
        }
    }

    pub fn toggle_done(&mut self) {
        self.done = !self.done;
    }
}
```

I tested this simply in the console before moving on to targetting for WebAssembly.

I've worked with language bindings before but this was my first hands-on experience with them. For the most part it was straightforward, just requiring some `Cargo.toml` setup and adding `#[wasm_bindgen]` annotations to my code. The main thing I needed to add was a method to serialize the Todo state for `JavaScript`.

```rs
#[wasm_bindgen(js_name = toObject)]
pub fn to_object(&self) -> Result<JsValue, JsValue> {
    serde_wasm_bindgen::to_value(self)
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}
```

Once that was done, I used `wasm-pack build --target web` to generate the `WASM` bindings and then linked them into my project to create a simple frontend for the todo app.

> For this, I just did some quick AI-generated styling and logic

{{< img src=todo.png >}}

## Getting Started with WebGPU

I won't go into too much detail in this post, but I've been closely following an excellent tutorial series by Ben Hansen at <https://sotrh.github.io/learn-wgpu/>. The guide does a fantastic job explaining all the boilerplate needed to get rendering up and running on screen, plus includes some great practical rendering examples to help you get your feet wet. I'll be back with more updates once I've made more progress through the material!
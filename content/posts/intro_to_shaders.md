---
title: "Introduction to Shaders"
date: 2023-05-06T13:26:32-04:00
draft: false
mermaid: true
tags: ["unity"]
category: ["Development"]
---

{{< toc >}}

Shaders are programs used to describe how pixels should be arranged, colored, and transformed on the screen. The simple definition extends to so many applications especially in 3D graphics in movies and games. Every computer generated prop placed in a scene is carefully designed to look a certain way, all with the help of shaders.

Shader's make use of the GPU to constantly run concurrent calculation on every pixel and you can decide what those calculations do through programming with languages such as **HLSL** and **GLSL**. You can decide that very pixel should be moved slightly to the left, or that they should be slightly more saturated under certain conditions, or even that they have follow the movement of a sine curve and create waves like an animation. You might start to realize that there is a lot a math involved and there is. Specifically, the way you want to arrange pixels makes heavy use of linear algebra to orient points in space as well as creative calculus to take advantage of functions when wanting to create tailored movements and patterns.

Nowadays, shader graphs also exist to help abstract way some of the underlying math and allow a more approachable method of developing shaders. Less so it is a crutch, rather it is a fantastic tool that aids in the accessibility of shader programming as well as better visual understanding of how the flow of calculations can change an unassuming list of pixels into an infinitely complex and infinitely beautiful final image.

This post covers a summary of [Freya Holmér's course] on Shaders (<https://www.youtube.com/watch?v=9WW5-0N1DsI/>). Note, that **the following notes are in the context of Unity shaders** as shaders across different frameworks and engines are implemented differently and thus invite differing workflows and architecture. Conceptually they will be mostly the same.

## How Are They Used

It's better to talk about shaders in the context of how they're used which is typically starting from some material being fed into a shader and then placed onto an object.
Depending on the framework or engine that you're using, shader's can be used very differently. For instance, in Unity, your first have to start with a base material and then feed that material information into the shader to perform calculations on to get the final texture.

{{< mermaid >}}
flowchart LR
    subgraph Shader Lifecycle
        x("Mesh") --> s("Shader")
        y("Material") --> s
        s --> f(("Final Mesh"))
    end
{{< /mermaid >}}

> Credits to [Navendu](https://navendu.me/posts/adding-diagrams-to-your-hugo-blog-with-mermaid/) for the tutorial on setting up Mermaid diagrams on Hugo

In other cases, you can directly apply a shader to an object or create the objects purely using shaders. It depends on the implementation of the graphics software but application is the same. **Manipulating pixels using the GPU**.

## What Calculation are Being Done in the Shader?

The shaders takes information from both the mesh itself and the material and allows you direct control over all those pieces of data and transform it to your liking. The information is broken up into multiple categories.

### Vertex Shader

From the **Mesh**, the shaders gets an overview of all the different vertices(points) that make up the 3D object and the following information for each vertex.

* Position Coordinates
* Normal (Where that vertex is facing perpendicular to it's surface)
* UV Coordinates
* Vertex Color
* More... (typically not needed)

The code you then write here can them perform any mathematical manipulation of the vertex as you'd like and it will run concurrently for every vertex by your GPU. At a lower level, the vertices that the shader receives will by local to the objects origin for example it's position. After you perform your manipulation, it must then by converted into **Clip Space** tobe used in the 3D world.his is also the set of vertices the fragment shader will receive. The next subsection will describe in more detail these coordinate systems.

{{< mermaid >}}
flowchart LR
    z("Local Space Vertices") --> x{"Vertex Manipulation"} --> c("Clip Space Coordinates") -->|sent to| v(("Fragment Shader"))
{{< /mermaid >}}

#### Coordinate Systems

> https://learnopengl.com/Getting-started/Coordinate-Systems

When meshes are shown onto the screen, the vertex information goes through multiple coordinate systems before it ends up mapped as a position on your screen. The shader will receive data in the first stage of these coordinate systems and will require conversion in order to understand how those vertex transformations relate to it's actual position in space and finally on your screen.

Though **the following coordinate flow is what's used for OpenGL** while Unity uses DirectX, the explanation of the differing coordinate spaces are helpful to know and relevant.

* Local Space - coordinates in relation to the objects origin
* World Space - coordinates in respect to the larger environment world
* View Space - coordinates in respect to what the camera perspective see's (particularly important when we compare how vastly different orthographic vs perspective camera represent space)
* Clip Space - Normalizes the coordinates between -1 and 1 based on the camera. Off camera view vertexes will be outside of this range and not visible on your screen.
* Screen Space - Transforms normalized coordinates to viewport coordinates.

For the purposes of Unity, what's important is the **Local Space** which is how vertices are fed into a shader and **Clip Space** which we can convert to using a built-in Unity API.

### Fragment Shader

Here, rather than calculating per vertices, Unity will rasterize the received vertices so calculations can be done per pixel and the shader will run only on pixels visible in the clip space (between -1 and 1). This process is done behind the scenes and it known as **Frustrum Culling**.

{{< mermaid >}}
flowchart LR
    z("Clip Space Vertices") --> x("Culled into Rasterized Pixels") --> c("Calculations") --> v(("Output on Screen"))
{{< /mermaid >}}

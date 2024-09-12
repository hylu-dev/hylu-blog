---
title: "Real Time Rendering Notes"
date: 2024-09-05T07:04:44-04:00
draft: false
cover:
    image: "https://www.realtimerendering.com/rtr4.jpg"
tags: ["graphics"]
math: true
mermaid: true
---

Some notes I've made while reading *Real-Time Rendering Fourth Edition*.

## Chapter 2 Summary: The Graphics Rendering Pipeline
{{< mermaid >}}
flowchart LR
    A[Application]:::app --> B[Geometry Processing]:::geo
    B --> C[Rasterization]:::rast
    C --> D[Pixel Processing]:::pix

    classDef app fill:#f9f9a3,stroke:#333,stroke-width:2px;
    classDef geo fill:#9fe0a6,stroke:#333,stroke-width:2px;
    classDef rast fill:#b5d3ff,stroke:#333,stroke-width:2px;
    classDef pix fill:#f9c1a3,stroke:#333,stroke-width:2px;
{{</ mermaid>}}

### Overview
The graphics rendering pipeline is a core concept in real-time graphics. Its purpose is to generate a 2D image from a virtual 3D environment, which includes objects, light sources, and a virtual camera. The pipeline ensures that objects are appropriately rendered by processing their geometry, materials, light interactions, and textures, among other factors.

### Main Stages of the Pipeline
1. **Application Stage**:
   - This is where the overall scene is defined, and decisions about animation, game logic, and user input are made.
   - Objects and their positions, movements, and transformations are sent to the next stage.

2. **Geometry Processing**:
   - Space transformations happen here like projections and clipping
   - Vertex shading and geomtry shading
   - Lighting calculations can also occur here, determining how light interacts with surfaces.
   
3. **Rasterization**:
   - Converts 3D primitives (triangles) into 2D fragments (pixels).
   - Determines which pixels correspond to which objects in the scene.
   - Rasterization is a core operation where pixels inside triangles are found and passed for further processing.

4. **Pixel Processing**:
   - Each pixel’s color is determined based on materials, textures, and light.
   - Techniques such as texturing and shading are applied here to compute the final appearance of each fragment.
   - Z-buffering resolves visibility, ensuring only the closest objects are visible in the final render.

### Pipeline Architecture
The pipeline functions in a sequential manner, but each stage works in parallel to ensure performance. Just as in an assembly line, each part of the pipeline processes its task and passes results to the next stage. The slowest stage dictates the speed of the entire process, making optimization crucial.

### Fixed vs. Programmable Pipelines
- **Fixed-Function Pipeline**: In older graphics hardware, the pipeline stages were fixed, with limited flexibility in what operations could be performed at each stage.
- **Programmable Pipeline**: Modern GPUs allow for flexibility through programmable shaders. Developers can write custom programs (shaders) that control how vertices and pixels are processed, enabling advanced effects and optimization techniques.

### Conclusion
The rendering pipeline has evolved over decades, becoming more programmable and flexible. Understanding the stages and their functions is essential for developing real-time graphics applications, as optimizations at each stage can significantly affect performance and visual quality.

## Chapter 3 Summary: The Graphics Processing Unit (GPU)

### Overview
The **Graphics Processing Unit (GPU)** is a specialized hardware device designed for real-time rendering. It excels at performing highly parallel computations essential for efficiently rendering complex 3D scenes. The GPU has evolved from fixed-function hardware into highly programmable units capable of running custom algorithms for various stages of the rendering pipeline.

### Key Concepts:
1. **Data-Parallel Architectures**:
   - The GPU’s power comes from its data-parallel architecture, where many shader cores execute operations simultaneously across multiple data points (e.g., vertices or pixels).
   - Each core performs specialized tasks like transforming vertices, calculating pixel colors, or applying textures, leveraging parallelism for high performance.

2. **GPU Pipeline Overview**:
   - The rendering pipeline on the GPU follows stages similar to the graphics pipeline:
     - **Vertex Shader**: Handles vertex transformations, lighting, and other per-vertex calculations.
     - **Geometry Shader**: Works with primitives (points, lines, triangles), allowing for operations like culling or tessellation.
     - **Pixel Shader**: Calculates the color and texture of individual pixels after rasterization.
     - **Merging Stage**: Combines pixel data, applies blending, and determines final visibility with depth (Z-buffering).
   - Some stages are programmable, while others remain fixed-function or configurable for efficiency.

3. **Programmable Shaders**:
   - Modern GPUs use **programmable shaders** to customize how vertices and pixels are processed. These are small programs written in shading languages (like GLSL, HLSL).
   - There are three main types of shaders:
     - **Vertex Shader**: Modifies vertex attributes, like position and texture coordinates.
     - **Geometry Shader**: Processes entire primitives, often used for geometry modification.
     - **Pixel (Fragment) Shader**: Handles the per-pixel color, texture sampling, and effects.
   
4. **Evolution of GPUs**:
   - Earlier GPUs were primarily fixed-function, but the introduction of programmable shaders revolutionized their flexibility.
   - The **GeForce 256** (released in 1999) marked the beginning of modern GPUs, moving from fixed-function to programmable pipelines, dramatically improving rendering performance and visual effects capabilities.
   - APIs like DirectX and OpenGL have evolved to harness the GPU’s programmability, providing developers with the tools to create sophisticated rendering techniques.

5. **Parallel Execution & Latency Handling**:
   - GPUs efficiently handle latency (delays in fetching data or performing computations) by switching between multiple threads or warps. This ensures that while one operation is stalled (e.g., waiting for texture data), other tasks continue to execute.

6. **Tessellation and Geometry Shaders**:
   - The tessellation stage is an optional hardware feature that dynamically increases mesh detail by subdividing triangles.
   - Geometry shaders operate on primitives and can generate or discard new geometry, contributing to efficient rendering.

### Conclusion
The GPU has evolved into a powerful, programmable processor focused on parallelism. It implements stages of the rendering pipeline with a combination of programmable and fixed-function hardware, allowing for flexible and highly efficient real-time rendering. Understanding how these stages operate and interact is crucial for optimizing graphics performance and visual quality.

## Chapter 4 Summary: Transforms

### Overview
Transforms are essential operations in computer graphics, allowing manipulation of objects, lights, and cameras. They enable positioning, reshaping, animating, and projecting objects in 3D space. Understanding transforms is crucial to ensuring computations occur within the correct coordinate systems and objects are projected correctly.

### Key Transform Types:
1. **Translation**:
   - Moves an object by a specific vector. 
   - Represented by a 4x4 matrix.
   - Transforms the position of an object in space.
   
2. **Rotation**:
   - Rotates an object around a specific axis (e.g., x, y, z).
   - Rotation matrices are orthogonal and preserve angles and distances.
   - Can be represented in several forms, including Euler angles and quaternions.

3. **Scaling**:
   - Changes the size of an object.
   - Scaling is affine, affecting the dimensions along the x, y, and z axes by specific factors.

4. **Shearing**:
   - Shear transforms slant the shape of an object along a particular axis.
   - Shearing matrices apply distortion while keeping lines parallel.

5. **Affine Transforms**:
   - A combination of linear transforms (scaling, rotation) and translation.
   - Represented by a 4x4 matrix to perform combined operations efficiently.

### Special Matrix Transforms:
- **Rigid-body Transform**: A combination of rotation and translation that preserves distances and angles, maintaining object shape.
- **Normal Transform**: A specialized transform used to correctly handle normals during scaling operations.
- **Matrix Decomposition**: Retrieving individual transformations (scaling, rotation, etc.) from a concatenated matrix.

### Quaternions:
- Quaternions are used to represent rotations without suffering from gimbal lock, a common problem with Euler angles.
- They enable smooth interpolation of rotations (slerp) and are frequently used in animation and physics.

### Projection:
- Projections are used to map 3D objects onto 2D screens.
- Two main types of projections are **orthographic** (parallel projection without perspective) and **perspective** (mimics human vision, objects appear smaller at a distance).
- Projection matrices involve adjusting the fourth coordinate (w-component) and may require homogenization.

### Applications:
- **Vertex Blending and Morphing**: Techniques for smooth animation of characters or objects by blending multiple vertex positions or shapes.
- **Geometry Cache Playback**: A method for efficiently storing and streaming high-quality animation data.
  

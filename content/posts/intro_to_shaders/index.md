---
title: "Introduction to Unity Shaders"
date: 2023-05-06T13:26:32-04:00
draft: false
cover:
    image: "https://acegikmo.com/shaderforge/images/web/screenshots/sf_ss_mainpage_b.jpg"
mermaid: true
tags: ["unity"]
category: ["Development"]
---

{{< toc >}}

Shaders are programs used to describe how pixels should be arranged, colored, and transformed on the screen. The simple definition extends to so many applications especially in 3D graphics in movies and games. Every computer generated prop placed in a scene is carefully designed to look a certain way, all with the help of shaders.

Shader's make use of the GPU to constantly run concurrent calculation on every pixel and you can decide what those calculations do through programming with languages such as **HLSL** and **GLSL**. You can decide that very pixel should be moved slightly to the left, or that they should be slightly more saturated under certain conditions, or even that they have follow the movement of a sine curve and create waves like an animation. You might start to realize that there is a lot a math involved and there is. Specifically, the way you want to arrange pixels makes heavy use of linear algebra to orient points in space as well as creative calculus to take advantage of functions when wanting to create tailored movements and patterns.

Nowadays, shader graphs also exist to help abstract way some of the underlying math and allow a more approachable method of developing shaders at the cost of some control. It's is a fantastic tool that aids in the accessibility of shader programming as well as better visual understanding of how the flow of calculations vastly change the look of a mesh.

This post covers a summary of [Freya Holmér's course] on Shaders (<https://www.youtube.com/watch?v=9WW5-0N1DsI/> & <https://www.youtube.com/watch?v=kfM-yu0iQBk/>). Note, that **the following notes are in the context of Unity shaders** as shaders across different frameworks and engines are implemented differently and thus invite differing workflows and architecture. Conceptually they will be mostly the same.

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

## The Unity Shader File

{{< mermaid >}}
flowchart TB
    s(.shader)
        s --- p(Properties)
        s --- ss(SubShader)
        ss --- pa(Pass)
            pa --- v("Vertex Shader")
            pa --- f("Fragment Shader")
    sk((ShaderLab)) --> p & ss
    h((HLSL)) --> v & f
{{< /mermaid >}}

### Vertex Shader

From the **Mesh**, the shaders gets an overview of all the different vertices(points) that make up the 3D object and the following information for each vertex.

* Position Coordinates
* Normal (Where that vertex is facing perpendicular to it's surface)
* UV Coordinates
* Vertex Color
* More... (typically not needed)

The code you then write here can them perform any mathematical manipulation of the vertex as you'd like and **the code you write will run concurrently for every vertex** by your GPU. At a lower level, the vertices that the shader receives will by local to the objects origin for example it's position. After you perform your manipulation, it must then by converted into **Clip Space** to be used in the 3D world.his is also the set of vertices the fragment shader will receive. The next subsection will describe in more detail these coordinate systems.

{{< mermaid >}}
flowchart LR
    z("Local Space Vertices") --> x{"Vertex Manipulation"} --> c("Clip Space Coordinates") -->|sent to| v(("Fragment Shader"))
{{< /mermaid >}}

In short, the job of the vertex shader is to...

* Manipulate the position of vertices
* Pass data into the fragment shader (ex. altering UV coords)

#### Coordinate Systems

> https://learnopengl.com/Getting-started/Coordinate-Systems

When meshes are shown onto the screen, the vertex information goes through multiple coordinate systems before it ends up mapped as a position on your screen. The shader will receive data in the first stage of these coordinate systems and will require conversion in order to understand how those vertex transformations relate to it's actual position in space and finally on your screen.

Though **the following coordinate flow is what's used for OpenGL** while Unity uses DirectX, the explanation of the differing coordinate spaces are helpful to know and relevant.

* Local Space - coordinates in relation to the objects origin
* World Space - coordinates in respect to the larger environment world
* View Space - coordinates in respect to what the camera perspective see's (particularly important when we compare how vastly different orthographic vs perspective camera represent space)
* Clip Space - Normalizes the coordinates between `-1 and 1` based on the camera. Off camera view vertexes will be outside of this range and not visible on your screen.
* Screen Space - Transforms normalized coordinates to viewport coordinates.

For the purposes of Unity, what's important is the **Local Space** which is how vertices are fed into a shader and **Clip Space** which we can convert to using a built-in Unity API.

### Fragment Shader

Here, rather than calculating per vertices, **Unity will rasterize the received vertices** so calculations can be done per pixel and the shader will run only on pixels visible in the clip space (between -1 and 1). This process is done behind the scenes and it known as **Frustrum Culling**.

> A cool side effect of this is **aliasing**. Imagine unity trying to figure out how to fit square pixels into the shape of a triangle face on a mesh. Some of those pixels will overlap outside the shape of the face and result in jagged edges which is what **anti-aliasing** serves to minimize.

Similarly to before, all code will run concurrently for every pixel.

{{< mermaid >}}
flowchart LR
    z("Clip Space Vertices") --> x("Culled into Rasterized Pixels") --> c("Calculations") --> v(("Output on Screen"))
{{< /mermaid >}}

In order to rasterize, an important process that happens is **Barycentric Interpolation**. This blends the colours of each of the vertices to make approximate the colour of pixels between vertices. Otherwise, there's no explicit information for Unity to know how these areas should be displayed.

![Barycentric](images/barycentric.png)

The fragment shader does not receive the vertex colours but instead, all the interpolated pixel colours.

In short, the job of the fragment shader is to...

* Determine the color of each pixel

## Unity Materials

Shader files are always associated with material files. You never apply a pure shader file to a object but instead a material which is then associated with a shader. This way, we can use the same shader across different materials.

### Shader Properties

You can pass information into the shader for use in calculation such as the game time or perhaps the health bar of a character. Using the health bar example, this can be useful as perhaps you want to proportion the filled amount of the health bar shown in the shader to it's actual game value. These properties can be set in the Material


## Code Structure of Shaders

```c
Shader "Unlit/SimpleShader" {
    Properties { // input data
        // _MainTex("Texture", 2D) = "white" {}
        _Value ("value", Float) = 1.0
    }
    SubShader {
        Tags {"RenderType" = "Opaque"} // allows determination of rendering properties. For the SubShader, this largely includes sorting alpha values, render queuing, etc.
        LOD 100 // level of detail, when you have multiple subshaders, they are prioritized based on this value

        Pass {
            Tags {} // Determination of graphics properties: blending modes, stencil properties, etc.

            CGPROGRAM
            #pragma vertex vert // tells compiler which function is vertex shader
            #pragma fragment frag // which function is fragment shader
            #include "UnityCG.cginc" // adds in built-in function from unity to aid in shader writing

            float _Value; // grabs from properties

            // sampler2D _MainTex; //texture stuff
            // float4 _MainTex_ST;

            struct MeshData { // per-vertex mesh data
                // Here you can decide what information you want to get from the mesh and store it in a variable by semantically declaring the data after a :
                float4 vertex: POSITION; // vertex position
                // float3 normals : NORMAL:
                // float4 tangent : TANGENT
                // float4 color : COLOR;
                float2 uv: TEXCOORD0; // uv0 coordinates
                //float2 uv1: TEXCOORD1; // uv0 coordinates
            };

            struct v2f { // data passed from vertex 2 frag shader
                float2 uv: TEXCOORD0; // 
                float4 vertex: SV_POSITION; // clip space coord of vertex
            };
            
            v2f vert(MeshData v) {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex); // converts local space to clip space
                return o;
            }

            // ## DATA TYPES
            // bool 0 1
            // int
            // float (32 bit float) good for world space
            // half (16 bit float) good for most things
            // fixed (low precision) -1 to 1
            // vectors: float4 -> half4 -> fixed4
            // matrices: float4x4 -> half4x4

            fixed4 frag(v2f i): SV_Target {
                return float4(1, 1, 1, 0);
            }
            ENDCG
        }
    }
}
```

### A Note on Shader Optimization

Generally, a mesh will have more pixels when rendered than vertices. It's usually best to do the calculations in the shader that has the least iterations. There may be more vertices than pixels in the case you have a high poly model being rendered from extremely far way. In which case after rasterization, you'll only have a few pixels for the fragment shader to process.

## Creating Shaders

### Displaying 'Normals' as Colours

![Normals Shaded Sphere](images/normals_shader.png)

> Notice how the colors coorespond to the normals. The top is green as the normal on the top of the sphere is the vector `(0, 1, 0)`, therefore mapping to green as the color.

First, we grab the normal data from the mesh

```c
struct appdata {
    float4 vertex : POSITION;
    float2 uv: TEXCOORD0;
    float3 normal : NORMAL;
};
```

Next, we assign the normals in our vertex struct to the normals we took of the mesh.

```c
v2f vert(appdata v) {
    v2f o;
    o.vertex = UnityObjectToClipPos(v.vertex);
    o.normal = v.normal;
    return o;
}
```

Then in our fragment shader, we display each pixel as a color with rgb set to the normal vector and an alpha we'll just set to opaque.

```c
float4 frag(v2f i) : SV_Target{
    return float4(i.normal, 1);
}
```

### Repeating Patterns

There are a litany of ways repeating patterns can be achieved and naturally so, many involve the use of wave functions.

To start, try feeding the uv position into a sin function and watch the results.

```c
float2 col = sin(i.uv.xy);
return float4(col.xy, col.x , 1);
```

You'll find that there's virtually no difference compared to just feeding those uv coordinate to the fragment shader directly. If you think about what the `sin(x)` graph looks from 0 -> 1, it doesn't oscillate in the range and instead only increases. To be able to see any amount of repetition, we need to increase the period. Increasing it by 2π or τ, will fit the whole first cycle into the 0 -> 1 range allowing us to see the beginning of some repetition. But let's get several more cycles in with 6τ so we get a fuller hatching pattern instead.

From there, we may also want to phase-shift to get a more symmetrical pattern by having the peak of the sin wave in the center.

Now the hatching bars are quite blurry since there is a smooth shift between colours as the the pattern moves across the sin wave. Instead let's have the values round to the nearest integer with a cool trick `floor`

```c
floor(x + 0.5) // Rounds down below .5 exclusive and rounds up above .5 inclusive.
```

Finally, we get this hatched shader

```c
float2 col = floor(sin(i.uv.xy*6*TAU - PI/2) + .5);
return float4(col.xy, 0, 1);
```

![Simple Pattern](images/simple_pattern.png)

We get can even fancier and add a wiggle to the stripes. For simplicity, let's add the wiggle just to the horizontal stripes. Intuitively, we want to do is shift the position of the pixels along the horizontal stripe up and down in a wave pattern.

Let's start by just adding an offset to those stripes.

```c
float offset = i.uv.x;
float2 col = floor( cos( (i.uv.xy+offset)*12*TAU)*.6 + .5 ); // I've made some period and amplitude adjustments as well
return float4(col.xy, 0, 1);
```

You'll notice that the horizontal stripes are now moving diagonally upwards because we're adding to them as we move left to right on the x-axis.

Now, it's as simple as adding a wave function to our offset and we'll get a smooth up and down wiggle to our line.

```c
float offset = .03*cos((i.uv.x)*6*TAU);
float2 col = floor( cos( (i.uv.xy+offset) *12*TAU) *.6 + .5 );
return float4(col.xy, 0, 1);
```

Similarly to the stripes themselves, I've adjusted the period and amplitude to change the look of the wiggles.

![Wiggle Pattern](images/wiggle_pattern.png)

> Notice, though I'm only focusing on adding the wiggle to the horizontal stripes, they've also influenced the period of the vertical stripes. As the wave function of the offset peaks, **we're also phase-shifting the vertical lines** which is why there are tighter grouping of vertical stripes after the peaks of the horizontal waves and bigger gaps after the dips.

### Blending Modes
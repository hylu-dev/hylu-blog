---
title: "Darkstar Showdown (NEXT 2024)"
date: 2024-01-10T01:02:05-05:00
draft: false
cover:
    image: "start.gif"
tags: ["gamedev", "c++"]
socialIcons:
  - name: "github"
    url: "https://github.com/hylu-dev/next-game"
---

## Darkstar Showdown

**Darkstar Showdown** is a 3D turn-based strategy game developed in C++ as an individual submission for the [Ubisoft NEXT 2024](https://toronto.ubisoft.com/ubisoft-toronto-next-2024-winners-celebrating-ontarios-student-talent-in-game-dev/) competition in the programming category, where it **won third place**. The game was created in just 3 days using a provided graphics API, and it centered around this year's theme of "firing projectiles."

{{< badge text="C++" icon="cpp" >}}
{{< badge text="opengl" icon="opengl" >}}

---

### Game Features

You and another player, pilot a spaceship separated by a dying *darkstar* with the goal of destroying the other player before the star implodes.

> Meet Dark-52, a dwarf star rumored to be abundant with resources and scientific knowledge. In the pursuit of advancement, nations have sent legions of ships to the star only to meet their unexpected doom as the star begins dying lightyears ahead of schedule. You and another player pilot the remaining ships from opposing nations. As death draws near, the two of you face off in a final showdown of triumph. The game starts with both players on opposite sides of the star. The goal is to confront the other player and shoot them down before the star implodes and kills everyone.

{{< tiles >}}
    {{< card src="camera.gif" >}}
        Turn-Based Camera Switching
    {{</ card >}}
    {{< card src="asteroids.gif" >}}
        Resource Collection and Upgrades
    {{</ card >}}
    {{< card src="reposition.gif" >}}
        Map Repositioning
    {{</ card >}}
    {{< card src="implode.gif" >}}
        Countdown to Star Implosion
    {{</ card >}}
{{</ tiles >}}

### Engine Features

I developed a custom entity-component-system alongside 3D rendering from scratch using a **line drawing API** provided by Ubisoft.

{{< tiles >}}
    {{< card src="primitives.gif" >}}
        Custom 3D Renderer
    {{</ card >}}
    {{< card src="plane.gif" >}}
        Vertex Shading
    {{</ card >}}
    {{< card src="density.gif" >}}
        Variable Mesh Density
    {{</ card >}}
    {{< card src="particles.gif" >}}
        Particle System
    {{</ card >}}
    {{< card src="easing.gif" >}}
        Animation System
    {{</ card >}}
    {{< card src="collision1.gif" >}}
        Collision Detection
    {{</ card >}}
{{</ tiles >}}

### How To Play

**Turn-Based**

Player's take turn making moves, being able to fly around and fire 3 bullets per turn. After each turn, those 3 bullets will be reloaded. Flying around costs fuel and will not normally replenish each turn so players must be careful not to run out of fuel early.

Both ships start rather weak, but they can destroy surrounding asteroids to gather a resource called scrap. Spend scrap to upgrade and refurbish your ship to prepare for combat.

**Star Pulses**

As the game progresses, the star will weaken and occasionally pulse having a few effects.

- Players will take a bit of damage but also have their fuel replenished
- The star will shrink and pull players and asteroids closer
- The positioning of asteroids and players will shift as well, disorienting the area.
- Pulses can be manually triggered by shooting the star

After enough pulses, players will be pulled so close that they will be forced to confront eachother. If that's not enough, after too many pulses, the star will explode leading to both players losing in a draw.

### Ubisoft NEXT

[Ubisoft NEXT](https://toronto.ubisoft.com/next/) is an annual competition run by Ubisoft that has contestants compete against a variety of disciplines within game development. From drawing art pieces, to level design, depending on your skillset you can test your abilities against others. The winner for each competition gets a 3-month internship with Ubisoft!

## Building a 3D Engine

I took a look at some [older submissions](https://toronto.ubisoft.com/2021-ubisoft-toronto-next-winners/) and noticed many of the successful projects tended towards 3D graphics. Makes sense as the technical challenges increase tenfold once you add the extra dimension. In an effort to create a successful project, I also opted to created a 3D engine.

### Goals

- Transform supporting interpolated movement
  - Ease-in-out, Ease-in, etc...
- 3D Rendering
  - Render 3D objects based on blender obj files
  - **Vertex shading**
- Game Structure
  - 3D Cube that rotates with scene changes
  - Camera aims closely at one side which holds the level
  - Then zooms out, cube rotates, and camera zooms back in on new side
  - Complete all sides to win
- Particle system
  - Consider spline based particles?
  - Verlet integration?
- Pseudo Skybox?
- Randomly generated levels
  - Of course I don't know the game topic
  - I can start though with generating a maze
  - And hopefully use that knowledge to apply to the game topic

I relied heavily on the amazing series from [One Lone Coder](https://www.youtube.com/watch?v=ih20l3pJoeU). It goes through everything from the matrix conversations to vertex creations, to camera controls and more.

### Shape Primitives With Flexible Vertex Density

### Vertex Shading

One of my favourite additions is the capability of vertex shading. My prior work in this blog is evident if my enjoyment of creating shader patterns using math functions so I wanted to include that in the engine. The implementation is pretty simple. Loop through all the vertexes and run some function on the position of each vertex.

```cpp
// MeshFilter.h
void SetVertexShader(std::function<void(float3&)> shader) { vertexShader = shader; }

// MeshFilter.cpp
for (auto& tri : tris) {
    Triangle triTransformed = tri;
    if (vertexShader != nullptr) {
        vertexShader(triTransformed.p0);
        vertexShader(triTransformed.p1);
        vertexShader(triTransformed.p2);
    }
}

// Prefabs.cpp
IMPLEMENT_PREFAB(Checker, {
    MeshFilter* meshFilter = entity->AddComponent<MeshFilter>();
    meshFilter->LoadMesh(PlaneMesh(40));
    meshFilter->SetVertexShader([](float3& vertex) {
        float height = vertex.y;

        height += 0.5 * sinf(30.0f * vertex.x + 5.0f * Time::Get().Elapsed());
        height += 0.5 * sinf(30.0f * vertex.z);
        height = 3.0f * std::floor(height);
        vertex.y += height;
        });
    })
```

This feature is dependent on high vertex density meshes for there to be enough detail to see the math functions. This is why I put the time into the ability to generate vertex dense meshes.

### Challenges

#### Projection Issues

The development of the 3D rendering for the most part went quite smoothly. However, once I implemented camera controls, I noticed there was a big issue that occurs when objects are placed far off from the camera. The expectation would be that the object would go out of frame, but instead, they would warp depending on they're distance away yet stay in view as if the camera was pointing towards them. Which it wasn't.

The issue is the way I normalize my vectors after projecting them into 2D space.

```cpp
if (normal.Dot(triTransformed.p0 - parentEntity->parentScene->GetCamera()->transform.position) < 0) {
    // World -> View
    triTransformed.ApplyMatrix(parentEntity->parentScene->GetCamera()->GetView());
    // Project 3D -> 2D 
    triTransformed.ApplyMatrix(parentEntity->parentScene->GetCamera()->GetProjection());
    triTransformed.Normalize();
}
```

The projection matrix already normalizes the points in cartesian space but the last thing we need is to adjust the coordinates based
on the `z` position. I blindly renormalized everthing again which forced every point to stay within a radius-1 circle from the origin;

Instead, the proper operation for projection is to divide each point by `z`.

```cpp
triTransformed.p0 = triTransformed.p0 / triTransformed.p0.w;
triTransformed.p1 = triTransformed.p1 / triTransformed.p1.w;
triTransformed.p2 = triTransformed.p2 / triTransformed.p2.w;
```

## Competition Day

The topic for this year's NEXT was incredibly broad. "Firing projectles".

In prior years, the topic was usually some old school game like Bomberman or Gravitar. This gave us a lot for room
for creativity on the kind of game we wanted to make.

Here are some of the notes I scribbled down during my ideation period for the game.

```
### Darkstar Showdown

- Two player turn-based shooter
- Dark moon
- Ships
  - Cones
- Projectiles
  - Cubes
  - Affected by gravity
- Camera switching perspectives
- Giant sphere that separates both players
  - Floating asteroids orbitting around
  - Shooting asteroids breaks into smaller bits that can be picked up for upgrades
    - Ship speed
    - Repair ship health
    - Projectile size/damage
  - Shooting the star makes it pulse
    - Becomes smaller (less obstacle)
    - Everyone takes 10 damage
    - Fuel is immediately maxed for everyone
  - Turns
    - After two turns, the star will automatically pulse 
    - You have 1 bullet each turn, it takes 1 turn to reload

- Final Menus
- Restart
- Clipping
- Depth Buffering

```
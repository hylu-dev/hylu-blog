---
title: "Interview Prep"
date: 2024-08-09T16:05:23-04:00
draft: true
cover:
    image: "https://repository-images.githubusercontent.com/397434315/c85b3065-4b1f-477b-ab17-7dd6222fe99e"
tags: ["gamedev"]
---

## Behavioral Questions

### WHOAMI

I'm an aspiring game developer. I have a background studying Computer Science primarily working with web technologies and front-end work. I've always been interested and inspired by visuals and creative design that led me to do a lot of work with UI projects working on University websites and small tool application at my prior workplace. After that, I got a lot of interest in graphics and game and I realized that is what inspires my and gets me excited. I've grown up with computer games with a love of indie games so something like creating a game has been a dream. That's what led me to joining Sheridan's one year program which was a great entry point for me into game development. I got learn how games are made, the technology behind it, and even building games has been a fantastic experience and reaffirms for me that this is something I want to do and improve on for the future.

### Game Design Principles

- Player-Centric Design: Knowing the target audience, knowing the player's expectations, have clear goals, work closely with feedback
- Game Balance: Game should be challenging in proportional to the player's skill
- FLOW: The flow-state where players are constantly immersed in the game
- Juice: Rewarding player actions with feedback. Increase satisfaction.
- Core Gameplay Loop: The sequence of gameplay the player will repeatedly experience. The games foundation.

### STAR Stories

#### Tell me about a time you worked on a challenging project. How did you approach it?

- **S** | For Ubisoft NEXT, I was tasked with creating a game in C++ with limited tooling amounting to mostly 2D graphics and some input and sound helpers. We had lot's of freedom. The game theme wouldn't be released until the weekend of the competition to which we'd have 3 days but we had some time to prepare.
- **T** | I wanted my game to be technically impressive for the judges to see I decided early to create a 3D game. At this point, I knew basics about how game rendering works but never delved much into the math or implementing it from scratch.
- **A** | I started off spending a few weeks on research from online tutorials, other projects to scope out how much work it would be implement it and get an idea of what I wanted to accomplish. Once I had ample resources, I went ahead and built a basic 3D rendering engine and some additional features that came in handy like collision detection and animation.
- **R** | Having spent the time learning and creating some small 3D demos from the competition, I was able have a strong starting point and comfort working in 3D. I was able to put together new game systems and logic much quicker and create a really ambitious games. The judges were impressed by my knowledge of 3D graphics and scope of the game which scored me a place in the finalists. 

#### Describe a time when you had to work closely with a designer or artist. How did you ensure smooth collaboration?

- **S** | When working on Slime Hunter, I was one of the programmers involved with implementing many of the core game systems that were actively being designed by one of our designers.
- **T** | I was tasked with implementing an inventory system in the game, the designers had created a UI mockup and discussed with me the requirements. The problem was, the scope of the system was too large for the time we had. As I was planning out the code design, I realized there were also a lot of minute details that weren't discussed. Will there be usable items? Sellable items? Item conditions?
- **A** | I met up with the designers to discuss the issue of scope and ask them to list out the inventory features and sort the requirements into three categories depending on how important they were. 
- **R** | With our requirements categorized, I was able to go ahead and complete a basic inventory system much more manageably given our time. Additionally, since we also listed some of other requirements, I was able to design our inventory to be modular and easily extendable so we can add those features later on. For example, I knew later down the line we wanted more UI Popups, Quest Item Rewards, Shops, etc. so I designed an event-based system that our other game systems can hook on to which ended up saving lot's of time later on.

#### Give an example of a time when you faced a bug or technical issue in a game you were developing. How did you resolve it?

- **S** | I was working on creating my 3D rendering engine. At this point, I had objects rendering on screen but I had major issues when rotating the camera or trying to place objects out of frame.
- **T** | Instead of going out of frame, they would just shrink into the edges of the screen like everything was in a 360 degree panorama. There was something wrong with my rendering code and I needed to figure it out
- **A** | I started off by running the code with the debugger and stepping through each step in my render pipeline to see if code was flowing in places I wasn't expecting, perhaps some part of the projection wasn't being run or transformations weren't being properly applied in the correct order. Despite going through many times, I couldn't find any issues there. Next I did a bunch of experimenting with a test scene where I could move the camera with the arrow keys and spawn objects so I can get a better idea of what the issue was. I realized that it wasn't just with placing the objects, even moving the camera around get issues. I took a break and thought about it and realized, okay so the rendered objects are stuck within the view space. That sounds like a clamping issue. Even more, I do a lot of normalization and maybe that's normalizing the positions of everything to be inside screen space instead of being clipped out. Upon closer look at my projection code that's exactly what happened. After projecting into screen space, I normalized everything.
- **R** | Once I was able to target where the issue was, the fix was an easy change of a few lines and the rendering finally worked!

## Coding Paradigms 

### DRY

> "Don't Repeat Yourself"

- Avoid Redundacy: Write reusable code
- Encapsulation: Common logic should be encapsulated in functions/classes
- Maintenance: Updates to logic only need to be made in one place
- Readability: Easier to follow logic when code isn't needlessly repeated

### SOLID

- **S**ingle Responsiblity: Each class should have one job or reason to change. Better modularity
- **O**pen/Closed: Software entities should be open for extension but closed for modification
- **L**iskov Substituion: Parent classes swappable with their child classes. A child class should extend and NOT change the base behavior.
- **I**nterface Segregation: Interfaces should be small and focused. Avoid classes needing to implement unused methods.
- **D**ependency Inversion: Don't have high-level modules depending on low level. 

> Ex. A NotificationSystem depending on an E-mail Sender.

Instead, have them both depend on abstractions.

> Ex. A NotificationSystem depending on a Data Sender 

### CI/CD

### Test Driven Development

## C++ Concepts

### Precompiled Headers

### Build Process

### Memory Management (Stack/Heap Diagrams)

### Smart Pointers

### Threading 

## Technical Interview

### Boyer-Moore Voting

## Game Programming

### ECS System

### Reducing Draw Calls

### Asset/Texture Management

### How Game Loops and Frame Rate Work

### Lighting

### Index/Vertex Buffering

### Matrix Tricks 

- Transformation
   - What can you do with Inverse Matrix?

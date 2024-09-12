---
title: "Interview Prep"
date: 2024-08-09T16:05:23-04:00
draft: true
cover:
    image: "https://repository-images.githubusercontent.com/397434315/c85b3065-4b1f-477b-ab17-7dd6222fe99e"
tags: ["gamedev"]
---

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

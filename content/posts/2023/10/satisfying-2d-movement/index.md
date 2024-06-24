---
title: "Satisfying 2D Movement"
date: 2023-10-13T22:35:08-04:00
draft: false
cover:
    image: "images/movement-1.gif"
tags: ["gamedev"]
---

I'm in the middle of working on my first mainline `c++` project at school. 

We're tasked with making a simple vertical spaceship shooter using `c++` with `SDL` and some pre-made assets to form the game. At the moment, I've set up most of the classes I will need and have a simple ship that renders onto the screen.

## Naive Movement

My first iteration of ship movement does have some forward thinking but allowing ship movement to continue by holding down keys. Using SDL polling, it's easy to want to bind movement directly to each game iteration and triggering of the SDL keydown event.
The problem is, standard keyboards when held have a delay on the first press before sending keyevents on every frame. What that looks like is the shape making a quick jerk, then pause, then start gliding across the screen.

To avoid that jerk, I use a simple `isMove` boolean to toggle ship movement on key presses which removes the dependency on the keyboard for continuous key events. This movements looks like the below.

{{< img src="images/movement-1.gif" class="img-md" >}}

You probably notice the lack of diagonal movement. I could add that quickly but it would be overridden anyways by the below method.

## Better Movement

The main issue with the previous movement strategy is that it feels too static and unnatural. In real life, vehicles don't immediately go from stationary to 100km/h. There's acceleration and decceleration that needs to happen for objects to get up to speed.

```cpp
// player input decides the direction vector. direction is 0 with no input
float pos[2] = { 0.0 f };
float direction[2] = { 0.0f };
float move[2] = { 0.0f };
float friction = .97f;
// normalize vector
float magnitude = (float)std::sqrt(direction[0] * direction[0] + direction[1] * direction[1]);
if (magnitude > 0) {
    direction[0] = direction[0] / magnitude;
    direction[1] = direction[1] / magnitude;
}

move[0] += direction[0] * speed * deltaTime;
move[1] += direction[1] * speed * deltaTime;

move[0] *= friction;
move[1] *= friction;

pos[0] += move[0];
pos[1] += move[1];
```

There's a quite a big more code now since I'm working with vectors to calculate the direction we're moving in at any given time. This still isn't the best implementation, especially since I don't have a nice way to cap out the movement speed. I would consider using either some interpolating or clamping to keep a hard cap on the speed. For now I've just hardcoded some friction that ensure the accelerated speed doesn't go on to infinity and also smoothly slows down when there's no movement at all.

{{< img src="images/movement-2.gif" class="img-md" >}}

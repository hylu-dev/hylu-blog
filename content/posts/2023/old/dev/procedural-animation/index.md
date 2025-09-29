---
title: "Rain World Procedural Animation"
date: 2023-06-07T15:59:24-04:00
draft: true
cover:
    image: "https://candlesign.github.io/Rain-World-Devlog/Images/Archived%20Images/rockFight.gif"
tags: ["animation"]
---

There's so many components to game development I want to learn about and the more I dig in, the more I feel like this hole of knowledge is neverending. It's also the fact that there's so much technology that's already been built and currently being built by people leagues ahead in expertise that it feels like a waste to start at anything only for it to be phased out by some new fangled technology.

Though, the more I look into the games that impress me the more I realize that development is full of creative ideas made on the fly and strong problem solving skills.

With that preamble aside, after playing Rainworld, I've gotten extremely interested in it's procedural animation. It's mindbending how everything seems to twist and move in 3 dimensions despite being purely 2D sprites and it all seems to be done with a lot of clever code and sprite design.

## Rain World Procedural Animation Research

I've done some looking around for tutorials on Rainworld animation and other than a popular [GDC Presentation](https://www.youtube.com/watch?v=sVntwsrjNe4), I couldn't find any direct tutorial other than comment speculations and surface level analysis. I'd seem to hit a rut until I found out that Joar's whole devlog is archived nicely at **<https://candlesign.github.io/Rain-World-Devlog/Home>**.

Starting from the top, the first few logs that talk about animation don't go far in depth but revealed to me that the sprites were indeed programmed frame by frame. Joar had done some experimentation with vectors but ended up doing it frame by frame. But that still doesn't answer the procedural aspect.

### Limb Animating

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#84>.

Rainworld limbs are have their extension animated frame by frame and then cleverly rotated through code depending on context.

{{< img src="<https://candlesign.github.io/Rain-World-Devlog/Images/Archived%20Images/wcbsyb.webp>" >}}

> Furthermore, the arms are coming together. I had to make three animations like the one above, because the arm needs to be able to rotate... inwards so to speak, but I think that it right now looks OK, or at least has the potential to look OK. - <https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#85>
> What you see here is the arm, in 0-8 extension modes and three different degrees of rotation towards the viewer, where the topmost is a profile where you see the bend of the elbow, while the third row is the same arm viewed from "above". Rows 4-6 are the same thing, but for the leg. - <https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#86>
> Thanks! The way I animate things is by a combination of pixel animation and a vector animation. I don't remember how much detil I go into, but there is some stuff on animation back there. - <https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#111>
> Very little is done with traditional animation, almost everything is done by the computer. - <https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#293>

### Procedural animation for jumping tied to AI

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#364>

### Overview of Early Animation

<https://www.kickstarter.com/projects/rain-world/project-rain-world/posts/720818>

### Vector Animating

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#570>

### Many Small Sprites for Animations

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#577>

### Climbing Animation

Hands are drawn infront of the graphics directly

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#581>

### Lizard Debug Examples Gifs

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#694>

### Shader Fading (Extra)

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#694>

### Vulture Early Animating

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#961>

### Vulture Shadow Warning

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#963>

### 1 Bit Sprites

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#1258>

### Rotating Lizard Gif

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#1275>

### Animations Only Positions

<https://candlesign.github.io/Rain-World-Devlog/Full%20devlog#1422>
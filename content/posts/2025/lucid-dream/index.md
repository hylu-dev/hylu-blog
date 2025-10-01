---
title: "20-day TapTap Spotlight Challenge 2024"
date: 2025-04-05T19:40:30-04:00
draft: false
cover:
    image: "cover.webp"
tags: ["gamedev", "unity", "game-jam"]
socialIcons:
    - name: "itchio"
      url: "https://teamnightcreature.itch.io/luciddream"
    - name: "submission"
      url: "https://www.taptap.cn/app/726246?os=pc"
---

## Lucid Dream | 20-day TapTap Game Jam 2024

{{< youtube KbYMe8j7UK0 >}}

{{< badge text="Unity" icon="unity" >}}
{{< badge text="C#" icon="csharp" >}}

> On a quiet night, you wake up suddenly from a dream, with only the flashlight in your hand as your guide. Ahead lies a journey full of unknowns and challenges. Can you ultimately find the exit and escape this dream?

Lucid Dream is a 3D puzzle game started by Team Midnight Creature during the [20-day TapTap Spotlight Challenge 2024](https://www.taptap.cn/poster/NEzmMvINUugV). We put together a team of friends consisting of:

- 3 designers
- 5 programmers
- 3 artists
- 1 musician

My role was the programming lead so I took care of managing the codebase, coordinating tasks between programmers, and ensuring feature integration aligned with the game design vision. I also implemented core systems like:

- Flexible shadow detection system with light layering
   - [Read more about that rabbit hole]({{< ref "/posts/2024/shadow-detection-with-render-textures" >}})
- Camera management and visual effect integration
- Lot's of bug fixing 😋

Despite the tight deadline, we hit all our milestones and submitted a completed game with **10 levels, fully original art, animation, music**. It was a huge learning experience in scope management, rapid prototyping, and cross-discipline communication.

> [You can check out our submission page here!](https://www.taptap.cn/app/726246?os=pc)

---

## Highlights

{{< tiles >}}
    {{< card src="lantern.webp" >}}
        Light up all the flowers.
    {{</ card >}}
    {{< card src="crab.webp" >}}
        Use the creatures to your advantage.
    {{</ card >}}
    {{< card src="exit-up.webp" >}}
        Progress across 10 hand-crafted levels.
    {{</ card >}}
    {{< card src="death.webp" >}}
        Beware of the ink!
    {{</ card >}}
{{</ tiles >}}

## Retrospective

### How I Got Involved

It was funny how I got involved with the project. I originally reached out to one of the artists to talk about one of my favorite games, [Warframe](https://www.warframe.com/). Coincidentally, the TapTap Spotlight Challenge was starting the next day—and they needed a lead programmer. And just like that, I was in.

### First Time as a Programming Lead

It was my first time acting as a programming lead and… it was rough.

Things were slow at the start. The codebase grew organically without much structure, and by day five it was already hard to navigate. We had five programmers, all with different styles and experience levels, working on overlapping systems with little time to align. Merge conflicts, duplicated logic, and unexpected bugs became daily occurrences.

On top of that, coordinating people with different schedules was a challenge—some teammates were only available at night, others during the day—making it difficult to keep the project moving smoothly and the codebase well-integrated.


### What I Learned

Despite the chaos, I learned a lot about the importance of **communication** and **structure** in a team project.

Many of the design paradigms I’d studied in school—and the use of tools like project management boards—finally made sense when I saw how fast an unstructured codebase can become unmanageable. 

Things like:

- Consistent naming conventions  
- Modular, decoupled architecture  
- Clear ownership of systems  

...weren’t just *nice to have*—they were **survival tools**.

By the end of the project, I had a much deeper appreciation for clean code, solid planning, and the leadership needed to keep a fast-moving, high-pressure project from falling apart.

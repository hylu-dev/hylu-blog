---
title: "Pianotypes: Virtual Piano"
date: 2024-06-24T05:55:12-04:00
draft: false
cover:
    image: "https://raw.githubusercontent.com/hylu-dev/pianotypes/master/pianotypes-demo.gif"
tags: ["development"]
---


## PianoTypes

PianoTypes is a web-based piano that provides a full-range, customizable piano that's fast, visually sleek, and easy-to-use. While there are similar sites out there, PianoTypes tries to stand out by being the fully featured package and replicates most of the fundamental requirements of a keyboard.

// List | Split Mode



There are many similar piano sites available but I've never been satisfied with them. I kept seeing clunky UI, limited features sets, and intrusive ads that hampered the user experience. I'm looking to add more customizability and refinement to this application in the future.

{{< video src="demo.mp4" >}}


## How it Began

I've studied and played piano for a large and meaningful portion of my life. In times where a physical piano isn't available, I've looked to online web options. Unfortunately, I could never find a good, fully-featured virtual piano that runs in the browser. Back in 2021 while studying web development, I decided to make this my first major project.

{{< img src="pianotypes_old.png" class="img-xl" >}}

## First Version

The first version of PianoTypes was developed as a front-end app using the following technologies. My goals were to design a web piano that was fast, sounded good, allowed pedaling, and was visually clean/minimal. Many of the other options lacked one or more of these features and so it was important to me that my version did.

- **VueJS** | Front-End Framework
- **TailwindCSS** | CSS Framework
- **tonal.js** | Music Theory Calculations
- **soundfont-player** | Instrument Sounds

The primary features I implemented are the following.

- Multiple Instrument Sounds
- Sustain Pedalling
- Ribbon Visualizer
- Adjustable Piano Range

I got the idea of the ribbon visualizer from the popular [Synthesia](https://synthesiagame.com/).

### Retrospective
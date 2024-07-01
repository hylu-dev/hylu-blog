---
title: "PianoTypes: Virtual Piano"
date: 2024-06-24T05:55:12-04:00
draft: false
cover:
    image: "demo.gif"
tags: ["development"]
---

## Extensive Virtual Piano

{{< badge text="Svelte" icon="svelte" >}}
{{< badge text="JavaScript" icon="javascript" >}}
{{< badge text="CSS" icon="css" >}}

> https://github.com/hylu-dev/pianotypes

**PianoTypes** is a web-based piano that provides a full-range, customizable piano that is fast, visually sleek, and easy-to-use. While there are similar sites out there, PianoTypes tries to stand out by being a fully featured package and replicates most of the fundamental capabilities of a keyboard and more.

{{< card src="pedal-and-controllers.gif" class="bottom" >}}
    Full Pedalling and Instrument Controller
{{</ card >}}

{{< tiles >}}
    {{< card src="midi-player.gif" >}}
        Midi Playback
    {{</ card >}}
    {{< card src="range.gif" >}}
        Adjustable Range
    {{</ card >}}
{{</ tiles >}}

{{< card src="input-modes.gif" class="bottom" >}}
    Row-Based & Split Key Bindings
{{</ card >}}

### Midi Playback Demonstration

{{< video src="demo.mp4" >}}

### AI Music Generation

I got interested in AI through a deep learning course offered at UofT. I leveraged **magenta.js** to add music generation functionality using a midi file as input. The generated music would then get played back by the piano.

{{< video src="magenta-demo.mp4" >}}

- **Steps**: The amount of music to generate
- **Temperature**: The amount of randomization to add to the music
- **Trim**: Whether to trim to inputted midi file to the specified seconds before generation

## How it Began

I've studied and played piano for a large and meaningful portion of my life. In times where a physical piano isn't available, I've looked to online web options. Unfortunately, I could never find a good, fully-featured virtual piano that runs in the browser. Back in 2021 while studying web development, I decided to make this my first major project.

{{< img src="pianotypes_old.png" class="img-lg" >}}

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


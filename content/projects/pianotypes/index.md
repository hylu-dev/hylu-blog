---
title: "PianoTypes: Virtual Piano"
date: 2024-06-24T05:55:12-04:00
draft: false
cover:
    image: "demo.gif"
tags: ["svelte", "javascript", "music"]
badges:
    - icon: "svelte"
    - icon: "javascript"
    - icon: "css"
socialIcons:
    - name: "website"
      url: "https://pianotypes.netlify.app"
    - name: "github"
      url: "https://github.com/hylu-dev/pianotypes"
---

## Virtual Piano

**PianoTypes** is a web-based piano that provides a full-range, customizable piano that is fast, visually sleek, and easy-to-use. While there are similar sites out there, PianoTypes tries to stand out by being a fully featured package and replicates most of the fundamental capabilities of a keyboard and more.

- **Svelte** | Front-End Framework
- **tonal.js** | Music Theory Calculations
- **smplr.js** | Instrument Sounds
- **MidiPlayerJS** | Instrument Sounds
- Simply **JavaScript** and **CSS**

---

## Features

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

{{< video src="demo.webm" >}}

### AI Music Generation

I got interested in AI through a deep learning course offered at UofT. I leveraged **magenta.js** to add music generation functionality using a midi file as input. The generated music would then get played back by the piano.

{{< video src="magenta-demo.webm" >}}

- **Steps**: The amount of music to generate
- **Temperature**: The amount of randomization to add to the music
- **Trim**: Whether to trim to inputted midi file to the specified seconds before generation

## Code Insights

### Managing Piano State

The heart of how this app works is modelling the piano as a single *reactive* store so any piece of the app can update the piano while also receiving updates to the piano.

{{< html >}}
<script src="https://gist.github.com/hylu-dev/e4aa52a63a3fe6e640b3034dd16483b5.js"></script>
{{</ html >}}

I depend on [derived stores](https://learn.svelte.dev/tutorial/derived-stores), to only listen to specific piano state changes to avoid unnecessary or unintended updates.

```js
export let note = '';
const keybinding = derived(hotkey, ($hotkey) => $hotkey.getNoteKeyBinding(note));
const isPressed = derived(piano, ($piano) => $piano.getIsPressed(note));
const isUpper = derived(hotkey, ($hotkey) => $hotkey.isUpper(note));
```

### Assigning Keybindings

To keep key bindings accessible across the app, I use similar method and store the bindings inside a store.

```js
class HotkeyStore {
    constructor(base) { 
        this.bindings = {};
        ... // Members
    }
    ... // Methods

    // Anything with a subscribe function is a store
    subscribe(subscriber) {
		return this._store.subscribe(subscriber)
	}
}

const hotkey = new HotkeyStore("C3");
export default hotkey;
```
Inside that store holds several methods for matching hotkeys onto the respective white and black keys of the piano. The following method I use multiple times to bind each layer of keys to the desired piano scale.

```js
/**
 * 
 * @param {Array} whiteKeys Array of keys to bind to white keys
 * @param {Array} blackKeys Array of keys to bind to black keys
 * @param {Array} scale The scale we want to bind notes to, typically chromatically
 * @param {Number} index The index of the scale to start binding from
 * @returns {Number} The index of the note last binded, can be reused to bind remaining scale
 */
__bindToScale(whiteKeys, blackKeys, scale, index) {
    let cScale = Scale.rangeOf('C major')(this.base, this.maxNote);
    let isWhite = (note) => cScale.includes(note) || cScale.includes(Note.enharmonic(note));
    let indexWhite = 0; // white keys
    let indexBlack = 0; // black keys
    if (isWhite(scale[index])) { indexBlack++; } // shift blacks keys 1 if starting on white
    while (indexWhite<whiteKeys.length && index < scale.length) {
        let note = scale[index++];
        isWhite(note) ? this.bindings[whiteKeys[indexWhite++]] = note : this.bindings[blackKeys[indexBlack++]] = note
        if (isWhite(note) == isWhite(Note.transpose(note,'m2'))) {
            indexBlack++;
        }
    }
    if (!isWhite(scale[index]) && blackKeys.length > whiteKeys.length && index < scale.length) {  // bind leftover black key if available
        this.bindings[blackKeys[indexBlack++]] = scale[index]; // don't increment index to allow this key to be doubly bound
    }
    return index
}
```

---

## How it Began

I've studied and played piano for a large and meaningful portion of my life. In times where a physical piano isn't available, I've looked to online web options. Unfortunately, I could never find a good, fully-featured virtual piano that runs in the browser. Back in 2021 while studying web development, I decided to make this my first major project.

{{< img src="pianotypes_old.webp" class="img-lg" >}}

The first version of PianoTypes was developed as a front-end app using the following technologies. My goals were to design a web piano that was fast, sounded good, allowed pedaling, and was visually clean/minimal. Many of the other options lacked one or more of these features and so it was important to me that my version did.
I got the idea visualzizing note presses as ribbons from the popular app [Synthesia](https://synthesiagame.com/).

{{< badge text="Vue" icon="vue" >}}
{{< badge text="Tailwind" icon="tailwind" >}}

- **VueJS** | Front-End Framework
- **TailwindCSS** | CSS Framework
- **tonal.js** | Music Theory Calculations
- **soundfont-player** | Instrument Sounds

At the time, Vue was on the rise and reigned in simplicity over frameworks like React and Angular which seemed like a good fit for a small app like this. I still enjoy using TailwindCSS for creating responsive layouts but nowadays, modern css is quite good and I prefer keeping app dependecies to a minimal.

### Original Features

The primary features I implemented are the following.

- Multiple Instrument Sounds
- Sustain Pedalling
- Ribbon Visualizer
- Adjustable Piano Range

Features like hotkey adjusting and midi-playback were not implemented here.

### Retrospective

I think the first version turned out well. It successfully served the purpose of giving a fast and sleek virtual piano. Though not yet "full-featured", it set up the building blocks for adding more functionality on top of the base piano.

One of the issues that kept me from adding features was the initial UI layout. I placed blocks to the left and right of the piano for all the settings which left very little space for adding anymore functionality. Additionally it crowded the space for the piano keys themselves. I felt a little stuck with little motivation at the time to rewrite the current layout.


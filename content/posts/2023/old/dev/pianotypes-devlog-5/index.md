---
title: "Pianotypes Devlog 5"
date: 2023-09-04T16:48:12-04:00
draft: false
cover:
    image: ""
tags: [""]
---

I finally put a start into replacing the current ribbon visualizer implementation with an HTML canvas drawn one.

## Why Bother?

To reiterate, the current visualizers works by filling the screen with vertical divs that are positioned identically to the piano keys so each key essentially has a identically width column above it. I then spawn divs inside each lane that act as each of the ribbons.

The extending animation works by settings each ribbon to the max size of the lane and running a `scaleY` transition from 0 to 1 to mimic the ribbon growing from nothing. Once the ribbon is released, I then query the DOM object for it's current length at that moment of the transition and then cancel the rest of the transition and manually set the div to that size. I also add a new transition that translates the ribbon from the bottom of the view until it's offscreen where it's then removed from the DOM.

It definitely works but there's two main problems that lead to my desire for replacing with an HTML canvas.

1. It's rather cumbersome to spawn that many DOM objects that are all styled and animating at once. I haven't personally run into any lag issues in my testing but from a design perspective, it's really inefficient.
2. The current scaling transition doesn't play well with round borders as it tries to scale those from 0 as well. This leads to a slight flicker once I end the transition and force the ribbons final size as the rounded borders snap to their final size.

Another smaller reason is that I'd like to add more effects like particles which is better done with `canvas` anyways.

## Current Progress

For now, I've just got the canvas setup and played around with creating ribbon blocks in it and animating the extension and translations of them. So far it looks great.

My next task is to figure out how I want to feed the key press events to the visualizer. Previously, I had a separate component for each note of the key that would just listen to keypresses for their individually note. Now, it's just one component that needs to keep track of all notes being pressed. Additionally, since I can't depend on the flexbox placements for the ribbon lanes, I need to notify the position of the key being pressed as well as the type of key so the canvas knows where and how to draw the ribbon.

Though, I'm not using TypeScript, I mocked up an object type to describe the type of info the canvas will need to hold for all of the current ribbons it needs to draw.

```js
type Ribbon {
    x: number;
    y: number;
    width: number;
    height: number;
    released: boolean;
}
```

I'm really conflicted now for how I should implement this. Even more, I'm wondering if I should rework how key press events are being handled as a whole...

Like maybe I should just keep a single store object that tracks the most recent key event like

```js
export const keyPressEvent = writable({});
```

And just have the piano listen to whenever this variable changes and react to it rather than what it's doing now which is listening to a dictionary that holds the current state of every key...

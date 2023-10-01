---
title: "Pianotypes Devlog 5"
date: 2023-10-01T02:07:05-04:00
draft: false
cover:
    image: ""
tags: ["pianotypes", "development"]
---

Not many code changes as of late but I've been more active on one of the packages I'm using to play sound, [smplr](https://github.com/danigb/smplr).

It's such an amazing package for playing instrument sounds with an incredibly simple and powerful api. Kudos to (danigb)[https://github.com/danigb/].

It's currently in early development which causes it to be prone to bugs. In particular, a number of key changes were made as of late that added to great new features and capabilities as well as some bugs I found while using them.

## Note Scheduling Throughput

The first change was a tweak to note scheduling that fixes an issue of the web audio getting overloaded and introducing lot's of static.

An [issue](https://github.com/danigb/smplr/issues/26) was opened a few months back that is now fixed.

danigb added a new queuing data structure that looks to better handle large amounts of notes as per [feat/player #30](https://github.com/danigb/smplr/pull/30/files). Definitely worth taking a look at in the future!

## onStart callback

This was a feature I requested and is key for my project as I need to visualize keypresses as well as key releases on the piano whenever a note is played.

web audio nodes don't have a built-in onStart callback so it makes sense why smplr didn't immediately include one either.

I used a pretty jank method of adding new web audio nodes and playing empty sounds with no duration only for them to trigger a callback when it ends. Since the duration is 0, the `onEnded` effectively acts as an `onStart`.

```js
let timingNodes = [];
const timingContext = new AudioContext();

function scheduleCallback(delay, callback){
    const osc = timingContext.createOscillator();
    osc.start(timingContext.currentTime+delay);
    osc.stop(timingContext.currentTime+delay);
    osc.onended = callback;
    // keep nodes in a list in case I need to stop them early
    timingNodes.push(osc);
}
```

But after some back and forth with some issues, danigb introduced a built in onstart as per my [suggestion](https://github.com/danigb/smplr/discussions/28)!

## Other stuff

I put a pause on my work into converting the visualizer into an html canvas for two reasons.

- My early implementation of `canvas` painting was actually lagging quite a big in comparison to the current HTML DOM elements.
  - My use of shadows are really slow to draw on the canvas especially when there's so many elements. I don't want to lose the shadows since they look really nice.
  - I still want to use canvas since the current implementations has some animation flickers and issues when the user is on a different tab.
- I'd need to rework my code a good bit since it's not designed well for accessing piano events from a centralized place quickly
  - Currently I have seperate component to handle ribbons for each note. A canvas would have to handle **every note** from within one component.

I also put a start into including [piano genie](https://magenta.tensorflow.org/pianogenie) functionality.

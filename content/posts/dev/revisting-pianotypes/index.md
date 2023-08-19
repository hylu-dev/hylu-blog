---
title: "Revisting Pianotypes"
date: 2023-08-18T17:50:32-04:00
draft: false
cover:
    image: "images/pianotypes.png"
tags: ["development", "svelte"]
---

I recently finished a course in deep learning and wanted to took a look at a few ways I could apply my knowledge to. The idea the came to me was to create an ai music generation model and feed it into my old pianotypes app. Simple right!

## It's all broken

So I booted up my old, dusty, untouched, forgotten, delapidated, abused, ramshackled, repository, and lo and behold, I can't get it to run. I tried updating packages, my nodeJS version, moving around code, but nothing worked. In fact, I think updating anything at all just made it worse. Mind you, this project has been mostly untouched for a couple years so it was prone to deprecated libaries and syntax that made it very difficult to remedy. At this point I've all but given up on trying to polish a giant heaping pile of rust.

## Time to rebuild

Easiest solution I figured was to just rebuild it all from scratch. I mean, it's not like the code isn't reuseable, it just needs some tuning as well as my on reviewing of the newest VueJS boilerplate. This honestly may have the quicker short-term solution but having been tired wading through annoying JavaScript syntax, I thought it good to look around for some other options.

**Svelte** was the number 1 result to came from my quick research around, it was well loved by the community due to it's much simpler and modern syntax a well as it being 30% (allegedly) faster than popular frameworks like React due it compiling your code to pure JavaScript rather than using a middleman like the virtual DOM. They had me at simpler syntax.

## Rebuilding with a new framework

Well, I don't want to talk too much about this part as it's just the usual finagling with new libraries and figuring out how to get things work. I do think it's funny how I wanted to choose the framework that involved the least amount of work when the least amount of work would've been to stick with the same one (VueJS) heh. Still, benefits quickly outweighted the cost as I quickly noticed how much less code I needed to write to do essentially the same thing. By the end I confirm, Svelte is fantastic.

## First hiccup

After I got the hang of reactivity in Svelte, it was pretty smooth sailing porting over everything from VueJS. Except, state management. Vue has a pretty comprehensive set of tool for handling global state which was extremely important for my project. I track nearly the entire piano state in a single class. From a design perspective, I dunno maybe it's bad, it certainly feels like it might be, but for my project it also has its benefits in simplifying state to one object. In VueJS, I can simply wrap the object in a reactivity wrapper and I can simply import the object in any of my components and get the the global state I need just like that.

In Svelte, a reactivy wrapper doesn't quite exist, instead they use a concept known as stores. It's honestly great in hindsight but for the way I've designed my piano state, the purpose of stores doesn't translate 1:1. I wrote another [post]({{< ref "/posts/dev/svelte-reactive-classes" >}}) that goes into more about how I got it done but it took a lot of research as well as trial and error before I could find a clean solution that I was happy with.

## Fixing old issues

This about the actual design of the old piano types project. I still liked the general aesthetic so I ported over most of the main CSS stylings as is. However the layout wasn't responsive to different screen sizes and crowded the area needed for the piano. This is something I realized even back when I was working on the original but I couldn't be bothered to fix it.

I had some prior ideas about moving everything into a pull out tab so I started with that approach and created a new pull out tray. I realized that a lot of the features that I planned to add to the piano tended to exist as it's own thing. Like I plan to add a midi player, that is fairly different from the pedalling features so it should probably have some separation in the UI. I added separated blocks in the options panel to contain each new feature that I add as well as some existing ones.

I put blocks for the piano controls as well as another block for hotkeys. I rounded the edges of each block which ended up making them look like widgets. So, I named the directory they sit in as `/widgets` and I will presumptuously continue to call them widgets.

## Getting to the new stuff

### Midi Player

The first new feature I needed to add was midi playback. While the goal is to use AI to generate music, I first need a way for the piano to play it. This went sooo much better than I could've expected. The piano itself is already all purpose while also being simple to operate. All it needs to receive what key to press and receive it at the right time to play a song. I found a nice library for parsing midi files that relays events in time with the midi files. All I had to do was hook up the midi events to key presses on the piano and it immediately worked.

### Hotkey Guides

Before we get to the Ai part, one of my favourite features I've added actually comes back to the hotkey system. Though I think I bound the hotkeys as sensibly as I could, it still quite confusing to learn their placements and actually play with them. So, my solution was the add visual guides on hotkey placements. Particularly, darkening and focusing out the keys that aren't bound and my favourite, raising the keys that are bound to the top keyboard row. Even to my surprise, this made it sooo much easier to read and I'm very happy with it. So much so, that I'll include a little gif. c:

{{< img src="images/hotkey-guides.gif" >}}

### Music Generator with MagentaJS

Originally, I planned to train my own music generation model with TensorFlow but this is hard. I'm pretty green on building decent models and training takes a lot of time. Instead, I came across MagentaJS which offers an API for AI music generation using high-quality, community made models. This was perfect for my needs and mitigates the problem of needing to build a good model myself.

> There was one issue integrating it into my project which was the fact that currently, MagentaJS isn't offered as an ESModule but whether just a JavaScript bundle. This is a problem because I'm using the Svelte framework which is designed to work with newer node version and ES standards. It expects ESModules and doesn't allow simple usage of the `Require()` statement to drop in JS bundles. I manage to find a work around through just adding a CDN script tag to the html directly. I prefer not to depend on a CDN and there are some drawbacks (No way for me to delay AudioContext creation), but this will have to work for now until MagentaJS is offered as a ESModule.

I used an LSTM model they have for generating new midi sequences given a variable length input sequence. The resulting sequences aren't all that spectacular and can only output single voice melodies rather than chords. As an aside, since MagentaJS comes with a bunch of midi processing tools, I was able to create a new midi playback for the music generation that relies on note scheduling rather than real-time inputs. It gives better timed songs and handles a larger thoughput of note. The drawback is scheduled notes don't allow live instrument changing, pedaling, or even playing along with it as that will cancel the scheduled notes. Because of the drawbacks, I opted to keep both midi playback options.

The midi generation space in AI is pretty underdeveloped from what I can see, so I think there's a lot of value later on for me to look into building better midi models. Particularly, ones that can play more than one note at a time.

---
title: "Svelte Reactive Classes"
date: 2023-08-12T20:29:42-04:00
draft: false
cover:
    image: "https://d2h1bfu6zrdxog.cloudfront.net/wp-content/uploads/2023/02/coderpad-semana-3-sveltestores.png"
tags: ["development", "svelte"]
---

I've been working on migrating my old PianoTypes project over from Vue to Svelte. So far the syntax has been much cleaner to use and has been an overall a great experience.
My first and primary pain point thus far has been implementing a global reactive state for the piano.

## The Problem

In Vue, it's possible to add a reactive wrapper to any object. In my case, I had created a class containing all of the piano data and property methods so all I had to do was wrap this class in the wrapper and state is maintained across all instances of my piano class.

## Making Svelete Classes Reactive With Stores

Let's start by creating a simple JavaScript.

```js
class ClassStore {
    constructor(num) {
        this.num = num
    }

    increment() {
        this.num++;
    }
}
```

When managing state with Svelte stores, the overarching paradigm is **everything with a `subscribe` method is a store**.

We can easily apply this to our class. Additionally, rather than implementing the class subscription manually, we can make use of Svelte's `writable` function to return all
subscribers the most up to date copy of our class.

```js
import { writable } from 'svelte/store';
class ClassStore {
    constructor(num) {
        this.num = num;
        this._store = writable(this);
    }

    increment() {
        this.num++;
        this._store.set(this);
    }

    subscribe(subscriber) {
        return this._store.subscribe(subscriber);
    }
}
```

Most notably, every single one of our class methods needs to call the `.set` method on our writable store. This way, every update to our class will notify subscribers.

## Subscribing to Properties of a Reactive Class Using Derived Stores

While we now have a reactive class, any subscription to the class will be set to react to **any** changes made to the class instance.
This can create a lot of unnecessary overhead and also result in undesirable updates.

For instance, when making a reactive class for a piano, I kept an internal dictionary
of the states of each piano key. Whenever a single piano key is pressed, the list updates resulting in every single (all 88) key to be notified.

We can instead, create a new store based off of our main store that only tracks the state of a portion of our original class. This is a [derived store](https://svelte.dev/docs/svelte-store#derived).

I've included a simplified version of the aforementioned piano store. This piano only holds 7 keys and whether they are being played.

```js
class PianoStore {
    constructor() {
        this.keyboardStates = { C: false, D: false, E: false, F: false, G: false, A: false, B: false };
        this._store = writable(this)
    }
    pressKey(note) {
        this.keyboardStates[note] = true;
        this._store.set(this)
    }
    releaseKey(note) {
        this.keyboardStates[note] = false;
        this._store.set(this)
    }
    getIsPressed(note) {
        return this..keyboardStates[note];
    }

    subscribe(subscriber) {
        return this._store.subscribe(subscriber)
    }
}

const piano = new PianoStore();
export default Piano
```

If we referenced the store directly, we'll get updates from any key update.

```html
// KeyC.svelte
<script>
    import piano from 'PianoStore'
    const note = 'C'

    $: if ($piano.getIsPressed(note)) console.log(note)
</script>
<div on:keydown={$piano.pressKey(note)} on:keyup={$piano.releaseKey(note)}></div>
```

This component will end up console logging no matter which note is pressed when we actually only want it to log when the current key `'C'` is pressed.

```html
// KeyC.svelte
<script>
    import piano from 'PianoStore'
    import { derived } from 'svelte/store';

    const note = 'C'
    const isPressed = derived(piano, ($piano) => $piano.getIsPressed(note));
    
    $: if (isPressed) console.log(note)
</script>
<div on:keydown={$piano.pressKey(note)} on:keyup={$piano.releaseKey(note)}></div>
```

Now we make a new derived store that is only reactive on the current note `'C'` state inside the `$piano.keyboardStates`.
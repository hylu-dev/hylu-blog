---
title: "Pianotypes Devlog 3"
date: 2023-08-23T09:29:07-04:00
draft: false
cover:
    image: ""
tags: ["development", "pianotypes"]
---

Today I spent some time working on getting the instructions dialogues up. I originally planned on creating a secondary overlay window that pops up given a trigger. Very similar to how to the toast notifications work but instead with a much larger area. The only problem with that is I wanted a clean way to inject custom html into the dialogue box depending on who triggers it. In the case of the toast notification I just pass it a string which is fine given it's only suppose to be a sure notifier anyways. For the instructions, I may need to add bullets or text stylings depending on what the instructions are for. Strings aren't going to cut it.

Instead of using some globally triggered dialogue, I instead fashioned a new options block component that with two **named slots**. One for the actual content and another that contains html for the relevant instructions and with a trigger, it will swap between showing the content or the instructions.

```svelte
<div class="options-block">
    {#if !showInfo}
        <div class="content">
            <slot name="content">
                <div style="font-size: 5rem;">&#63;</div>
            </slot>
        </div>
    {:else}
        <div class="info">
            <slot name="info">
            </slot>
        </div>
    {/if}
    <button on:click={() => showInfo = !showInfo}>&#63;</button>
</div>
```

This way, the instructions for the dialogues are all nicely encoded into the html rather than needing to send html using js. For the trigger, I just added a small *absolutely position* questions mark button at the corner of each options block.

{{< img src="images/options-block.png" >}}

Now the syntax to create a new widget in the options panel with instructions just requires indicating which **slot** you want to child content to belong in.

```svelte
<OptionsBlock>
    <PianoPedal slot="content"></PianoPedal>
    <div slot="info">
        <p>
            piano pedalling
        </p>
        <ul>
            <li><b>sustain pedal</b> <em>space</em>: holds the duration of played notes</li>
            <li><b>sostenuto pedal</b> <em>rshift</em>: unimplemented</li>
            <li><b>soft pedal</b> <em>lshift</em>: softens velocity of played notes</li>   
        </ul>
    </div>
</OptionsBlock>
```

I also took the chance to reorganize the music generation block by separating out the playback portion and he generation portion to make it easier to differentiate the two features.

{{< img src="images/magenta.jpg" >}}

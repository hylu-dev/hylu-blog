---
title: "Dream Beyond the Sky"
date: 2026-11-05T12:00:00-05:00
draft: true
cover:
    image: "cover.webp"
    alt: "A girl dozes at the foot of a great tree at night while fireflies drift around her."
tags: ["gamedev", "webgl", "javascript", "gaussian-splatting"]
socialIcons:
    - name: "github"
      url: "https://github.com/hylu-dev/dream-beyond-the-sky"
---

<!-- TODO: an opening line or two in your own words: why this project, what you set out to make. -->

## Dream Beyond the Sky | 梦越苍穹

{{< badge text="JavaScript" icon="javascript" >}}
{{< badge text="PlayCanvas" >}}
{{< badge text="Gaussian Splats" >}}
{{< badge text="WebGL" >}}

> She dozes at the foot of a great tree on a floating island. When she wakes, the night gives way to dawn, she walks to the edge, and steps off into the sky.

Dream Beyond the Sky is a short cinematic flight game that runs in the browser. Its world is two Gaussian-splat captures, an island and a sky, with an animated splat character, painted clouds and modelled cliffs layered on top. It takes a few minutes from the title screen to waking up again, and you steer for part of it.

> [Play it at dream.hylu.dev](https://dream.hylu.dev). It works on desktop and phones (hold your phone sideways).

---

## The dream, in nine moments

{{< tiles >}}
    {{< card src="title-screen.webp" alt="She dozes under a great tree at night as fireflies drift around her." >}}
        The title screen. She dozes under the tree while fireflies drift round her and light her up.
    {{</ card >}}
    {{< card src="approach.webp" alt="The camera pushes in to her sleeping face as black letterbox bars close in." >}}
        Press Start and the camera comes in to her sleeping face.
    {{</ card >}}
    {{< card src="waking-to-dawn.webp" alt="Night turns to a golden dawn over cliffs and a waterfall as the camera turns from her face." >}}
        She wakes and looks up, and the night gives way to one dawn.
    {{</ card >}}
    {{< card src="golden-vista.webp" alt="A golden sun over a sea of cloud; the girl rises into frame from below." >}}
        Golden hour over the sea of cloud. She rises into frame as the camera backs away.
    {{</ card >}}
    {{< card src="step-off.webp" alt="The girl stands at a grassy cliff edge facing the sun, then drops out of sight." >}}
        At the sunlit edge, she steps off.
    {{</ card >}}
    {{< card src="launch.webp" alt="The girl tumbles through a white cloud bank and comes out flying among floating cliffs." >}}
        She bursts up out of control and gets it back. Inside the cloud bank, the island becomes the sky.
    {{</ card >}}
    {{< card src="flying.webp" alt="Flying over clouds, banking left then right between floating cliffs." >}}
        Then it's yours to fly: steer with the mouse, a held finger, or WASD.
    {{</ card >}}
    {{< card src="storm.webp" alt="The sky turns grey, the edges of the screen darken, and a cliff looms ahead." >}}
        The storm. The sky greys out, the dark closes in, and a cliff looms.
    {{</ card >}}
    {{< card src="waking-up.webp" alt="A blurry view clears to show her back under the tree at golden hour." >}}
        And she wakes, back under the tree.
    {{</ card >}}
{{</ tiles >}}

---

## How it's built

The game runs on [PlayCanvas](https://playcanvas.com/) with Viggle's splat engine on top. Almost everything you see is a [Gaussian splat](https://en.wikipedia.org/wiki/Gaussian_splatting): the island and the sky are each a capture of 1,048,576 splats, and she is a rigged splat character driven by eleven animation clips over a 441-bone skeleton.

A panorama capture only holds up near the spot it was captured from, so the whole opening is staged around that. The cameras stay close to the capture point, frame the far realm with a long lens, and keep back from her face, with one quick pass beside it on the turn to the sun.

<!-- TODO: anything you want to say about where the captures and the character came from. -->

The flight swaps scenes partway. As she flies into the cloud bank the screen blooms white, the island capture is switched off and the sky capture switched on, and from there the sky is built from three layers:

- **Painted clouds:** four hand-painted billboards, tinted to the light of each scene.
- **Floating cliffs:** four formations modelled in Blender by a script, painted, and streamed along her flight path.
- **Distant birds:** painted silhouettes far off in the sky.

### Finding the look

The painted pieces went through a few rounds each.

{{< img src="clouds.webp" alt="Cloud studies, from a plain grey puff to painted cumulus, ending with four cloud sprites." >}}

{{< img src="cliff-models.webp" alt="Four 3D models of floating rocks: a grassy spire with ruins, a detailed version, three blocky columns, and a slab with grass and hanging ivy." >}}

{{< img src="textures.webp" alt="Painted stone and foliage textures before and after, plus meadow grass and a trailing ivy strip." >}}

Even the favicon took two rounds. The painted marks were lovely and unreadable at 16 px, so the flat "Dawn" won.

{{< img src="favicons.webp" alt="Fifteen icon options of suns, clouds and floating islands, with the chosen semicircular sun and cloud highlighted." >}}

---

## Nine days

{{< img src="timeline.webp" alt="Timeline from 18 to 26 October listing each day's work." >}}

The first commit already had a title screen, a dawn and a flight. Most of the shape came the day after: the leap and the sky scene, waking under the tree in the golden hour, the score, and the crash. The game also went through two names before this one.

{{< img src="then-and-now.webp" alt="Three title screens with different game names, above five flight screenshots showing the sky changing over the project." >}}

<!-- TODO: a favourite moment or a dead end from those first days. -->

---

## Making it work on phones

It ran well on desktop. On my iPhone 13 Pro, it often didn't, and the second half of the project went to fixing that.

- **Garbled scenes on iPhone.** On some loads, the fireflies kept moving over a frozen, distorted island. Safari's WebGPU path sorts the splats on the GPU, so phones now draw with WebGL instead.
- **Waiting less for the title.** The title screen used to wait for every scene, model and animation. Now it waits only for the island, her, and the opening's animations, and the sky and the cliffs load during the opening. If they're late, she waits at the cliff edge with a small loading bar.
- **Smaller files.** WebP textures, and animation clips stripped of data they never used. The download went from 77 MB to 57 MB.
- **No freeze into the clouds.** The sky capture and the cliffs' shaders are warmed up on the empty-ledge shot, out of sight, instead of on the frame where they appear.
- **Music that actually starts.** Safari won't buffer a media element until it's told to play, so the flight music could wait forever for data that never came.
- **Phone details:** fullscreen past the notch, a restart screen if iOS takes the GPU back, Add to Home Screen for real fullscreen, and link previews.

<!-- TODO: your take on building this, and anything you'd do differently. -->

> [Play Dream Beyond the Sky](https://dream.hylu.dev) · [Source on GitHub](https://github.com/hylu-dev/dream-beyond-the-sky)

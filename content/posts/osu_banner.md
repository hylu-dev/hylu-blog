---
title: "Making an Animated Osu Banner"
date: 2023-05-02T01:18:34-04:00
draft: False
cover: 
    image: '/img/osu/banner/osu_banner.gif'
    alt: ''
    caption: ''
tags: ['osu', 'blender']
categories: ['Art', 'Gaming']
---

I decided to make my own osu banner. My profile was looking pretty empty without one and I figured after all that work to put together my own rendition of *Enchanted Love*, **might as well put those meshes to more use**. I wanted to keep it fairly simple as I know I'm pretty limited in gif size and quality for it to work as a profile banner (otherwise if it's too large, the auto-compression will convert the image into a static jpeg).

## Compositing

I did some playing around and took some inspiration from this amazing art work.
{{< tweet user="bigheadcrusher" id="1477679577824886784" >}}
From my previous artwork, **I already had a lot of the patterns created as well as familiarity with the style** so it really was a process of just stamping around different shapes and decorations until I liked it.

Once the main banner was done, I exported them in layers so I can seperate out where I want the foreground and backgrounds to be in relation to the animated characters.

![Layered Export](/img/osu/banner/layering.gif)

## Layering into Blender

With those exported, I moved on to organizing them into Blender. **It took me a while to realize that just importing them is as images wasn't going to render**. Turns out pure image objects are more for just reference than anything. Instead, I needed to create an actual object in Blender and have the image on it as a texture. Luckily Blender has a nifty addon to import images directly as plane objects which will render.

However, I had a lot of trouble getting images as planes to show up because in my original project, **I forgot I removed the world lighting entirely** so any objects with just the base shaders would just render black with no light. Once I realized this, **I had to create a new shader**. It seemed simple enough by just plugging in the image color directly into the material output but I forgot about the transparent parts of the images, they would also just render black this way. I managed a solution by mixing the image colors with a transparent shader and deciding when to mix into transparent based on the alpha channel of the image. Looking at it now, seems pretty obvious, but boy it did not come easy.

![Image Shading](/img/osu/banner/image_shading.png)

Once I finally got the images texture to show in full color, I could start layering up the banner.

![Plane Layering](/img/osu/banner/plane_layering.png)

## Animating

Animating was pretty simple, I only animated the positions of the characters and props with a subtle rotation to *Mocha's* head to give her a little bit more life as well as the beach ball. The rotation is really the coolest part as it suddenly gives the 2D scene a lot more depth.

![Animating](/img/osu/banner/animating.gif)

Last thing to do was pop in a final render and we're done!
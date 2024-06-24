---
title: "Dot Product and How it Relates to Light"
date: 2023-09-14T14:57:16-04:00
draft: false
cover:
    image: ""
tags: ["math"]
math: true
---

## What Matters

The dot product has a bunch of properties when you use it's raw **scalar** output but honestly most of the times you will use the dot product is to find **the angle between two vectors** by rearranging to equation as follows

$$
A\cdot B = |A||B|cos\theta
$$

$$
\theta = \arccos(\dfrac{A\cdot B}{|A||B|})
$$

$$
where\\ A\cdot B = A_x \times A_y + B_x \times B_y
$$

In games, this equation is used exhaustively to calculate light projections and field of view.

## What Is It?

{{< youtube TBpDMLCC2uY >}}

A standard definition of the dot product is as follows

> The dot product, also called scalar product, is a measure of how closely two vectors align, in terms of the directions they point. - Robert Sheldon

A simpler version of this is just "how much are these vectors pointing in the same direction"?

Personally, though I find this characterization to be confusing as it really only applies with your vectors are of length 1. Still, let's start with this intuition and work forwards

{{< img src="https://cdn1.byjus.com/wp-content/uploads/2022/09/Dot-Product-Of-Two-Vectors-1.png" >}}

Imagine, you're trying to figure out how similar two vectors `A` and `B` are. To start, with can stick them together tail-by-tail and try to get a gauge of how much their direction diverges.

The dot product serves to answer that question by saying "hey, let's start with the vector `A`, if we want for it to equal `B`, what we can do is draw a new vector we'll call `C` so that `A + C = B`". Though it doesn't stop here. If we just blindly create a vector connecting `A` to `B`, it's too complicated to figure out how `A+C` is related to `B`. Instead, let's take this vector `C` and point is **perpendicular** to `B`, like it's casting a *shadow* onto `B`. Now that we have this right angled triangle, we can get the adjacent side of the triangle that point in the direction of `B` and use that length as a gauge of how similar `A` and `B`.

If you think about it, the further the angle these two vectors point, the smaller the adjacent side will get. As well, if the vectors are the same, the shadow casted by `A` onto `B` will just be the same vector.

## The Whole Dot Product

With that in mind, we're left with two points of comparison. The casted shadow of `A` represented by \\(acos\theta\\) and the vector `B` itself.

If we multiply them, we get the equation for the dot product

$$
|A||B|cos\theta
$$

But hey wait a minute! Why are we suddenly multiplying `B` to the equation? Doesn't this ruin the whole intuition of showing how closely these two vectors point in the same direction?

This comes back to what I said earlier where this intuition only applies with vectors of length 1, or in other words, "unit vectors". Otherwise, we'd be better off just removing the second vector for the equation entirely.

There are some cases where the pure dot product value is useful such as how an angled force applies onto an object.

Mathematically, this form of the dot product is properties such as the distributive and associative properties that require the product of two vectors to be the case.

This article is quite messy as I need work on my understanding through application but I'll come back to this another day.

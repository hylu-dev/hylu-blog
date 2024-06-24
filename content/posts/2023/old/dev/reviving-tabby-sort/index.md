---
title: "Reviving Tabby Sort"
date: 2023-08-23T22:23:06-04:00
draft: false
cover:
    image: "https://lh3.googleusercontent.com/ouAehAR2Mqj6qNfiGf_fB0faYB0ox4iDxZxZviDR_0ewGRCBkL1btFmnPkyfGsS-mT_WoE0_0PhfLLIE29o11kZb=w640-h400-e365-rj-sc0x00ffffff"
tags: ["development", "chrome"]
---

A couple years ago I made a little extension for chrome to organize and sort tabs by url domains. It was really quick and crudely designed and since I wasn't even a Chrome user, I didn't think too much about improving it.
Fast forward to now, I decided to do exactly that.

## Looking at old code

Actually the code was mostly better than I expected, other than some variable naming and redundant lines, I didn't see much need to rewrite it. The html on the other hand needed some tuning and was pretty messily put together. There was lot's of redundant styling and a disappaering timeout on the buttons that I wonder why I even thought was a good idea in the first place.

## New features

I didn't know initially what I wanted to add feature wise but after taking a quick look at the [chrome tabs api](https://developer.chrome.com/docs/extensions/reference/tabs/), I found a few functions I could make use it.

- **Hiding**: I added an option to automatically close the groups when sorting
- **Labeling**: I added an option for automatic group titles based on the tab domains
- **Sorting and Redesign**: To support the new options I simplified the UI and created checkboxes to add on the hiding/labeling/sorting to the grouping. That's also to say I also replaced the `SORTING` button to the `GROUPING` button where it just groups instead of sorting as well.

Coding it was fairly simple though I had some annoyances since most of all the tab updating and retrieving functions were promises so I needed to format my code to work with it. Additionally, I hit a dumb wall not being able to hook on to Chrome's tabGroups api before realizing that I needed to request permissions to access that api in the manifest. This is what I get for coming back to this so much later.

Final thing I did was created a Chrome developer account and pay a $5 fee to get the extension up on the Chrome Web Store.

<https://chrome.google.com/webstore/detail/tabby/enmendkpkmeeaoboologanofpjccoipm>

---
title: "Starting the School Year"
date: 2023-09-05T11:33:26-04:00
draft: false
cover:
    image: ""
tags: ["personal", "tabby"]
---

Today is my first official day of class attending the Advanced Programming program at Sheridan College.

To commemorate this, I've reorganized my whole directory structure for this blog to be organized by year and month rather than sub topics. I've been finding the subtopic folders to be growing far to fast (particularly the dev folder) to keep posting all in one place.

This way, my working directory is ever only so large for each month and I'm also relieved of the duty of figuring out which folder I should be making my post in. I mentioned before how I feel too inclined to make each blog post substantial and with purpose rather than just posting freely. I think uncategorizing each post will make it easier to just post updates and devlogs as well.

Unrelated, I made a quick update to my tabby extension cause it turned out to have some pretty glaring bugs my friend notified me about.

1. The grouping grabbed the tabs from very window rather than the current working window
2. Group labels were often assigning to the wrong group of tabs

The first issue was an easy fix as it I just needed to add an extra parameter to my tab query to only check for the current window.

```js
chrome.tabs.query({ currentWindow: true}, tabs => {});
```

The second issue was a failure of an assumption I made that when I use the tab grouping api, it will place that group in the location of the relevant tabs and I used that index to assign the correct label. In actuality the order that order that groups end up in are a bit more haphazard than that. Or... something else might be happening but I was too lazy to figure out so I'll just go with that.

Instead I just made a new query into the tabs of the group and retrieved the domain again from there.
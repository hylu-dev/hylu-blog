---
title: "Pianotypes Devlog 2"
date: 2023-08-21T13:18:35-04:00
draft: false
cover:
    image: ""
tags: ["development", "pianotypes"]
---

I'm a bit more than late for a second devlog but I figured there's no better thing to call this. I originally made this blog for the purposes of short and sweet devlogs but my recent posts have been bit larger than what I originally intended. I'm hoping with this log to bring that focus back down to just that.

Since my previous post, I've done a lot of fine tuning of the UI and functionality of the site. One I'm quite happy with was adding draggability to the inputs simialr to other software like Blender. It's a lot more convenient than typing and allows you to set options easily using mouse only.

Furthermore, I've added some toast notifications for some short logging and responsive text to user actions. I want to add some text guides to the options and while this is a step in that direction, it isn't quite it. At least I have a way to logging errors to the user for now.

Next, I took a look at the midi playback, particularly the scheduled playback using smplr. Because the smplr soundfont player only has a callback for the ending of notes, I don't have a way to notify the piano when to press a key, just when to release it. My temporary solution was to just use timeouts but it had time inconsistency issues. I thought I might try making a PR on smplr to add an onstart callback but after looking at the web audio API, it turns out it's not as easy as it might seems. The reason why smplr has an onended callback in the first place is because it use scheduled web audio nodes that come with an onended callback but not an on start.

I did some scouring and found a hacky solution on StackOverflow to create a duplicate audio node that's silent and play that only for the purpose of it's callback. If I set the delay and duration of that node to be the same, it effectively makes its start and stop identical giving me an onstart callback. I replaced my timeouts with audio nodes, as well as creating a secondary audiocontext so I don't overload my original since now I effectively have double the audio nodes in use. The result is my keyboard presses being completely in sync with the playback! AudioContexts have a much better timing system than timeouts.

I think my next focus is finally getting those instructions dialogues in cause that's the main feature that's keeping from having more people try the app.
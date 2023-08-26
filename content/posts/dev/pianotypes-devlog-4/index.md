---
title: "Pianotypes Devlog 4"
date: 2023-08-25T21:51:48-04:00
draft: false
cover:
    image: ""
tags: ["development", "pianotypes"]
---

Not too much to report.

I had the realization that I can pause the scheduled notes by suspending the AudioContext since they depend on the context's timer. It'd be pretty easy to add pause functionality. The only caveat is that if I pause the AudioContext, than all sound from the piano is also paused. Perhaps I could code in a notice to resume the timer given the user inputs a key press but I don't want to resume the context on every key press. Maybe I could write some code to resume on the first user input on pause.

All in all, this is starting to seem a bit messy having to handle the AudioContext in weird ways in relation to the piano. Perhaps it'd be worth to consider separating out the soundfont player from the piano store so I can better treat them individually. I'm not really sure but pause functionality would be nice.

Apart from that, my main concern is the current freezing during generation which this operative solution would be to run it as a background worker. Not sure though how I'd be able to delegate the uploaded file to a background file since it runs separately. Maybe there's a way to pass items between the two contexts I'd have to look into.
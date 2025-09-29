---
title: "Building Mini Escape Maker with AI"
date: 2025-08-23T17:29:49-04:00
draft: false
cover:
    image: "cover.webp"
tags: ["ai", "web-development", "cursor"]
---

I took part on a project tentatively named **"Mini Escape Maker"** - an educational tool that lets teachers create interactive mystery games for their students. I focused mainly on the front-end implementation.

## Project Overview

It's a tool targeted towards educators to help build interactive mystery games (in the style of escape/clue games). The idea is you start with some mystery story where there's an array of suspects. 

Educators then create pairings of **clues** and **tools**, and students can match them up in order to produce **findings**.

{{< img src="cards.webp" >}}

Once they have enough findings, they can try to guess who the culprit is.

> **The core concept:** In order to match clues and tools to findings, educators can put any challenge they want. For instance, they can put numbers on the clues and tools, and in order to find the correct finding card, they need to complete a math equation to get the right ID for the findings card.

While educators can do this process manually, we can also make use of **LLMs** to generate this content procedurally to further streamline the process.

In our case, we use OpenAI and **prompt engineering** to ensure our generate results are fit for use.

{{< img src="generate.webp" >}}

## My Experience with AI-Assisted Development

I took the lead on designing and implementing the front-end. I wanted to produce something **simple and sleek** for quick development with a clean UI.

> **Context:** While this isn't the first time I've used AI for development, this is the first time using it end-to-end for a whole project. Usually I tend towards a more **70/30 split** of manual coding alongside AI, but my time budget for this project was limited. I needed to ensure I could get this out as fast and well-done as I could.

### What Worked Well
- I had been a little out of practice with web development, so using the AI chat really helped me not need to look up syntax or structure
- It's **incredible** at generating simple layouts super quickly

### What Didn't Work So Well
- The moment you start adding logic, things can get **dangerous**
- It's okay if logic is self-contained, but once many different pieces need to interact, it can get really messy
- AI often **overcomplicates** simple requests
- As the project scales, you may have developed a nice API to solve a problem, but Cursor may not pick up on it and instead develop a whole new solution to solve your problem
- As your project scales, if you don't have a good grasp on the project architecture, Cursor **slows you down**
- It's easy to auto-pilot on Cursor and start asking it the simplest questions that may take a few seconds to modify, but because I've been so dependent on the AI, I don't know where to look and instead wait minutes at a time for Cursor to do it for me


## Key Lessons Learned

### Framework Choice Matters: Opinionated vs. Flexible
- For example, using **TailwindCSS**, Cursor tends to go all over the place with class usage and doesn't bother to create reusable or maintainable themes
- Really hard to keep UI consistent this way
- Gets worse as things scale
- I used **BulmaCSS** which is really opinionated, and since it constrains the options for Cursor, it made the generated code a lot simpler and a lot more consistent

### Plan for Scalability from the Start
- Depending a lot on AI generation can be **super fast** but can end up slowing you way down as things get more complicated
- For simple prototypes, the value is there, but often you end up with code that you wouldn't want to work on again

### The Hybrid Approach: Architect Yourself, Let AI Implement
- If you tell AI to build a whole system, there's no telling how it will do it. Often it creates whole applications in single files with no scalability
- If you architect things yourself and give AI very specific commands, it makes the AI results a lot higher quality
- The more modular the code, the easier it is to work with in the future. This is obvious, but with AI it's super important because even if it generates not great code or code you don't understand, if you make your systems modular, they can at least be self-contained and don't have you tracing dependency hell to understand the code

### The Joy of Manual Programming
For long-term projects, programming things nicely is just much more of a **delight**. For AI-generated stuff, all the delight is just getting things done quick.

---

## Conclusion

I'll continue to use AI—it's such a great tool. I'll just have to be careful using it as a learning or efficiency tool but not let it replace the **importance of good software engineering practices**.

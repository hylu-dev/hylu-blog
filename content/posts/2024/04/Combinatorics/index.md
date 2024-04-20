---
title: "Fundamentals of Combinatorics"
date: 2024-04-19T21:13:54-04:00
draft: false
cover:
    image: "https://www.shutterstock.com/image-vector/fraction-chance-colored-balls-possibility-260nw-2409114537.jpg"
tags: ["Math"]
math: true
---

## Why I'm Writing This

This semester I took a role tutoring MATH14998 (Computer Math) at Sheridan College. I originally felt a little out of water given how long it's been since last studied math. Throughout the term, I've learned a lot about what it takes to teach and some of my short comings and strengths. One of them being, I have a sense of what concepts are particularly difficult grasp and finding ways to explain them so that the students can actually understand the concepts rather than memorize formulas. Now my delivery of the explanations could use some work but I've put together some explanations that I'm quite proud of, one of them being combinatorics. And so, I've included a compilation of those notes here.

## What is Combinatorics

Well it's simply about counting and arranging things. How many groups can you make out of a classroom of 40? How many ways can you pull marbles out of bag. These are the types of questions that combinatorics tries to answer. Things can get more complicated as we introduce more complex questions and formulas but one should never forget what it is at core.

**It's simply about counting and arranging things**. This will always be the case and often this topic seems more complicated that it needs to be because we forget this tenet.

In this article, I will be covering three topics in combinatorics.

- Counting
- Permutations
- Combinations

## Counting

Of the three topics, this is arguably the most important. Permutations and combinations can both be done purely by counting. In fact, their formulas are just shorthands for counting which I will show later on. For now let's take a look at what counting is.

When you have \\(X_1\\) group of ways to do something and \\(X_2\\) group of ways to do something else. You can multiply them together to get the total number of ways to do something. For instance, **two dice rolls**.

$$
X_1 \cdot X_2 = 6 \cdot 6 = 36
$$

For brevity, let's try again with two dice where each die only has 3 sides. I'll also list out all the possible rolls.

$$
X_1 \cdot X_2 = 3 \cdot 3 = 9
$$

- {1, 1}
- {1, 2}
- {1, 3}
- {2, 1}
- {2, 2}
- {2, 3}
- {3, 1}
- {3, 2}
- {3, 3}

Notice that the set include cases where **both rolls are the same** or are the **same but difference order**.

- {1, 1}
- {1, 2} & {2, 1}

A more familiar to describe this would be to say the arrangements in the set

- Allow **repetition**
- Ensure **order matters**
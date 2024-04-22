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

## Permutations

A review of the permutation formula.

$$
\frac{n!}{(n-r)!}
$$

- \\(n\\) - total number of items
- \\(r\\) - the number of items to pick from

We use this to solve problem where there's

- No repetition
- Order matters

### Arranging all items

For example, let's say we have a bag with 1 red, 1 blue, and 1 green marble. How many ways can we pull out 3 marbles? Using the permuation formula, our total items are 3 and the number of items we are picking out are also 3.

$$
\frac{3!}{(3-3)!} = 3! = 6
$$

**But we can actually do this just by counting!**

The difference from the previous counting is that each time we pick a marble, we remove on from the pool. So each time, we have one less way to choose. As long as we remember this, we can still just multiply.

$$
(3)(2)(1) = 3! = 6
$$

It ends up being the same calculation.

### Arranging subset of items

Previously, we did the simplest form of a permutation where \\(n\\) = \\(r\\). Which reduces the formula to just \\(n!\\). What about if we don't pick all the marbles?

Let's pick from the same bag of 1 red, 1 blue, and 1 green marble. How many ways can we pick out a marble?

$$
\frac{3!}{(3-1)!} = \frac{3!}{2!} = 3
$$

**We can still solve this by counting**. All we have to do now is also count the amount of items we aren't including and remove them from our arrangements.

$$
\frac{(3)(2)(1)}{(2)(1)} = \frac{3!}{2!} = 3
$$

### Permutations is counting

Ultimately, permutations is just a shorthand for more complex counting problems. We introduce factorials to take care of repetition and introduce division to remove from our selection. But still, each component just makes clever use of counting.

To summarize, permutations takes care of problems where:

- **We remove repetition**
- **We can choose the number of items to pick from**
- Order still matters

## Combinations

Notice how the combination formula is just the permutation formula with a small alteration.

$$
\frac{n!}{r!(n-r)!}
$$

Notice it's nearly identical to the permutation formula except we're moving another \\(r!\\) arrangements from our total.

This means combinations should give similar results to permutations. But what do we remove? We add the condition thatorder doesn't matter. In other words, we only consider **arrangements different if they have different items**, not if they're differently ordered.

If we were making groups in a class, something like

- {Sarah, Max, Carl}
- {Max, Sarag, Carl}

would not be counted as two separate groups. They would be the same group.

> Mathematically we divide out an additional r! because there are r! to arrange r items where order matters. So we get rid of those items by dividing.

### Combinations is permutations without order

Because the combination formula is so similar to permutation, it's now wonder that they're results are so similar. The only difference is we don't differentiate order.

= There's no repetition
- We can choose the numbers of items to pick from
- **Order doesn't matter**
---
title: "Binary Math"
date: 2023-09-12T16:56:05-04:00
draft: false
cover:
    image: "https://images.unsplash.com/photo-1569396116180-210c182bedb8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
tags: ["math", "c++"]
math: true
---

## Two's Complement Representation

### Why We Use It

In c++, signed integers are represented in two's complement notation. Before I get to how that notation works, I want to explain how we use it.

Comparing both representations, `-1` would look like this

```c
// Decimal
4294967295

// Binary Signed Int
10000000000000000000000000000001

// Two's Complement Signed Int
11111111111111111111111111111111
```

The normal signed binary representation is pretty easily understood if you know what a sign bit is. You just have the typical binary for `1` with the most significant bit being the sign bit to indicate that it's negative. **Then why the heck do we use two's complement instead?** Isn't it just more confusing?

There are a few drawbacks to the normal method.

- Notice we have two ways to represent `0` (`0000` vs `1000`) so we waste a bitset
- Often, the sign bit can end up outside our initial bit range after an addition
- Addition between signed ints doesn't work
  - In this scenario we need to increase our bits to get the sign but we incorrectly lose the bit that should be in the 4's column.

$$
5 + (-5) = 0
$$

$$
0101 + 1101 = 10010
$$

### How it Works

Ben Eater has a fantastic explanation below

{{< youtube 4qH4unVtJkE >}}

We can start by adding the **one's complement** which involves just flipping all bits (excluding the sign bit). If we try adding both of these binaries together, we get much closer to the answer but you'll find that your result is off by `1`.

$$
5 + (-3)
$$

$$
0101 + 1100  = 1
$$

What we can do is simply add `1` to our flipped bits and this solves our problem. The result we get is precisely the **two's complement**

There's actually a nice mathematical meaning if we analyze what the two's complement is really saying.

Take the two's complement of `5`

$$
1011
$$

What the most significant bit is really representing in this form is `-8`, and that's being subtracted from lesser bits which add up to `3`, therefore giving a bit representation of `-5`!

Therefore, most languages will use two's complement for signed integers under the hood. In particular, for negative numbers, the compiler will know that when they encounter the negative sign bit how to convert to following bits to produce the correct numerical result.

### Negating a Number to Two's Complement

To summarize, let's negate the number `5`

$$
0101
$$

1. Convert to one's complement by flipping bits

$$
1010
$$

2. Convert to two's complement by adding `1`

$$
1011
$$

## Unsigned Int Added to Signed Bit

```c++
unsigned int un = 2;
int n = -3;
PrintUnsignedBits(un + n);
PrintSignedBits(-2147483647);

>
Unsigned Int (un + n)
Decimal Representation = 4294967295
Bit Representation = 11111111111111111111111111111111

Signed Int (-3)
Decimal Representation = -2147483647
Bit Representation = 10000000000000000000000000000001
```

The unsigned bit takes precedence resulting in the negative sign bit from the `-3` being the most significant postive bit in the result.

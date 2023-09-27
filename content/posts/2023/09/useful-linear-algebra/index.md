---
title: "Useful Linear Algebra"
date: 2023-09-25T12:17:47-04:00
draft: false
cover:
    image: ""
tags: ["math", "development"]
math:  true
---

## Dot Product

- Find the interior angle between two vectors

$$
A\cdot B = |A||B|cos\theta
$$

$$
\theta = \arccos(\dfrac{A\cdot B}{|A||B|})
$$

$$
where\\ A\cdot B = A_x \times A_y + B_x \times B_y
$$

## Cross Product

- Get perpendicular vector from two vectors
- Find area created by two vectors (for 2D, parallelogram area, for 3D, parallelepiped area)
  - This is the magnitude of perpendicular vector

## Matrix Multiplication

There is a formula for calculating the resultant matrix from a matrix multiplication.

$$
\begin{bmatrix}
   X_{22} Y_{11} + X_{12} Y_{21} &
   X_{22} Y_{12} + X_{12} Y_{22} \\\\
   X_{11} Y_{21} + X_{21} Y_{11} &
   X_{11} Y_{22} + X_{21} Y_{12} 
\end{bmatrix}
$$

But it's much more meaningful to think of a matrix multiplication of multipling matrix A by each column of matrix B.

Similar how you would transform a vector by multiplying it by the matrix, you're transforming each component of the matrix which describes the coordinate space.

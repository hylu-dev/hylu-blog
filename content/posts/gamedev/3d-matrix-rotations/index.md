---
title: "3D Matrix Rotations"
date: 2023-06-15T02:03:50-04:00
draft: False
cover:
    image: ""
three: true
module: "script.js"
math: true
tags: ["shaders"]
category: ["Development"]
---

 Rotation is one such transformation and that can be achieved by locking the desired axes of rotation and transforming the rest of the axes by \\(sin\\) and \\(cos\\).

## Intuition of 3x3Matrix Transformations

3x3 matrices can be used to bend the coordinate space in 3 dimensions, effectively allowing any desired transformations to objects in that space.

As the coordinate space is being transformed, it's helpful breaking up the matrix into its unit vectors

$$
\vec{a} = x\begin{bmatrix}1\\\\0\\\\0\end{bmatrix} +
y\begin{bmatrix}0\\\\1\\\\0\end{bmatrix} +
z\begin{bmatrix}0\\\\0\\\\1\end{bmatrix}
$$

Imagine taking a 1x1x1 unit cube from our coordinate space and aligning each of the sides to the given unit vectors of the matrix. Every unit in our coordinate space will be the same and any vectors within that space will have each component vector scaled.

## The Rotation Matrix

The same idea applies if we want to rotate our coordinate space. We want to be able to translate each unit axis in a circle based off of some angle. Remember at each point of a unit circle, height is equal to \\(sin\theta\\) and width is equal to \\(cos\theta\\). We can can then use those as our vector inputs to follow a constant circle based off of \\(\theta\\).

{{< img class="img-xs" src="https://assets.website-files.com/621ca7b6009267905d98302b/62f2b425837a662e4220d242_Trigonometric%20Functions%20and%20Unit%20Circle.png">}}

We get the following matrices for rotating about each axis of rotation.

$$\def\rmatrices{
R_x(\theta) = 
\begin{bmatrix}
1 & 0 & 0\\\\
0 & cos\theta & -sin\theta\\\\
0 & sin\theta & cos\theta\\\\
\end{bmatrix}
R_y(\theta) = 
\begin{bmatrix}
cos\theta & 0 & sin\theta\\\\
0 & 1 & 0\\\\
-sin\theta & 0 & cos\theta\\\\
\end{bmatrix}
R_z(\theta) = 
\begin{bmatrix}
cos\theta & -sin\theta & 0\\\\
sin\theta & cos\theta  & 0\\\\
0 & 0 & 1\\\\
\end{bmatrix}
}
\rmatrices
$$

Let's take a look at how the \\(R_z(\theta)\\) matrix was formed as it's the easiest to visualize since looks like a 2D rotation. If we want to rotate by an axis, we don't want any coordinate on that axis to move while everything rotates around it.

Therefore we set the zcomponent to \\(\begin{bmatrix}0\\\\0\\\\1\end{bmatrix}\\) to multiply any values on it by 1.

-unfinished-

## Sandbox Example

$$\rmatrices$$

{{< html >}}
<style>
    .range-menu {
        display: flex;
        flex-flow: column;
        flex-grow: 1;
        margin: 1ch;
    }
</style>

<form style="display:flex;" autocomplete="off">
    <div style="display:flex;flex-direction:column;">
        <div id="range-x" class="range-menu">
            <input id="range-x1" type="range" min="-3" max="3" step=".3">
            <input id="range-x2" type="range" min="-3" max="3" step=".3">
            <input id="range-x3" type="range" min="-3" max="3" step=".3">
            <input id="range-x4" type="range" min="-3" max="3" step=".3">
        </div>
        <input id="range-xall" type="range" min="-3" max="3" step=".3">
    </div>
    <div style="display:flex;flex-direction:column;">
        <div id="range-y" class="range-menu">
            <input id="range-y1" type="range" min="-3" max="3" step=".3">
            <input id="range-y2" type="range" min="-3" max="3" step=".3">
            <input id="range-y3" type="range" min="-3" max="3" step=".3">
            <input id="range-y4" type="range" min="-3" max="3" step=".3">
        </div>
        <input id="range-yall" type="range" min="-3" max="3" step=".3">
    </div>
    <div style="display:flex;flex-direction:column;">
        <div id="range-z" class="range-menu">
            <input id="range-z1" type="range" min="-3" max="3" step=".3">
            <input id="range-z2" type="range" min="-3" max="3" step=".3">
            <input id="range-z3" type="range" min="-3" max="3" step=".3">
            <input id="range-z4" type="range" min="-3" max="3" step=".3">
        </div>
        <input id="range-zall" type="range" min="-3" max="3" step=".3">
    </div>
</form>

<div id="three-container" style="display:block;height: 400px;width: 100%;"></div>

<script id="vertexShader" type="x-shader/x-vertex">
    uniform mat4 m1;
    uniform mat4 m2;
    uniform mat4 m3;
    void main() {
    gl_Position = projectionMatrix * modelViewMatrix * m1 * m2 * m3 * vec4(position.x, position.y, position.z, 1.0);
    }
</script>

<script id="fragmentShader" type="x-shader/x-fragment">
    uniform vec2 resolution;
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        uv *= 40.;

        vec3 color = vec3(.2, .7, 1.);
        gl_FragColor = vec4(color, 1.0);
    }
</script>
{{< /html >}}
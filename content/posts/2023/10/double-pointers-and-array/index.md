---
title: "Double Pointers and Array"
date: 2023-10-03T14:40:52-04:00
draft: false
cover:
    image: ""
tags: ["c++"]
---

Quick look at how we can assign a double pointer to an array.

Normally we can create a pointer array like this.

```cpp
int* arr[5];

for (int i = 0; i<5; i++) {
    arr[i] = new int(1);
}
```

If we want another pointer to point to this array we need to use a double pointer. We can also index that pointer like an array once we've assigned it.

```cpp
int** p = nullptr;
p = arr;

for (int i = 0; i<5; i++) {
    std::cout << p[i];
}
```

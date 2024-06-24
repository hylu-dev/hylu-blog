---
title: "Stack and Heap"
date: 2023-09-27T10:08:53-04:00
draft: false
cover:
    image: "https://craftofcoding.files.wordpress.com/2015/12/stackmemory31.jpg"
tags: ["c++"]
---

## Declaring Data Structures on the Heap

> <https://stackoverflow.com/questions/8036474/when-vectors-are-allocated-do-they-use-memory-on-the-heap-or-the-stack>

```cpp
vector<Type> vect;
```

will allocate the vector, i.e. the header info, on the stack, but the elements on the free store ("heap").

```cpp
vector<Type> *vect = new vector<Type>;
```

allocates everything on the free store (except vect pointer, which is on the stack).

```cpp
vector<Type*> vect;
```

will allocate the vector on the stack and a bunch of pointers on the free store, but where these point is determined by how you use them (you could point element 0 to the free store and element 1 to the stack, say).

## Dangling Pointers on the Heap

So the idea with dangling pointers is that if you allocate a piece of memory in the heap you need a pointer to pointer to that slot of memory. That's a given.

```cpp
int* p  = new int(5);
```

Now if you want to release that block of memory, you use the pointer to free it.

```cpp
delete *p
```

But there's a problem! You now have a pointer just pointing to a random block of memory that can be used by anything.
This is a **dangling pointer**.

## Dangling Pointers on the Stack

If variables go out of scope in the stack, it gets released from the stack so we don't need to depend on `delete`. However we can still get the dangers of dangling pointers.

```cpp
int* DoSomething() {
    int x;
    int* p = &x;
    return p
}

int* a = DoSomething();
```

`a` now points to an unused piece of memory in the stack! This is dangerous cause that memory space could be taken up by something later on and we don't want to mess with that memory.

### Difference With Uninitialized Variables

An uninitialized variable is generally a bad idea

`int x;`

If you dereference it, you could get anything depending on whatever was left there in memory. This is not as bad as the aforementioned *dangling pointer* though as at least that memory block is being used by `x` so it won't be used later down line until `x` is released.

```cpp
int x;
```

## Memory Leaks

If you allocate some memory on the heap, you should always have a pointer leading to it. If you lose those pointers, than you'll have no way of accessing that memory.

That is, **you won't ever be able to free that memory**.

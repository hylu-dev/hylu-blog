---
title: "C++ Test Review"
date: 2023-10-16T13:48:23-04:00
draft: false
cover:
    image: ""
tags: ["c++"]
---

Just some scattered notes for test review.

## Object Composition

Object memory is stored contiguously. If an object has pointers, those pointers are still stored contiguously but point to wherever the data is.

### Object Ownership

- One simple approach is to say that whatever creates the object becomes the owner of the object
- Thus, it becomes responsible for deleting it

## Inheritance

### Polymorphism

```cpp
Zombie* bob = new Zombie("Bob");
Zombie* sally = new ZombieSoldier("Sally", 100);

bob->attack(); // prints "Bob throws a punch"
sally->attack(); // prints "Sally throws a punch"
// wait...
// ...............?!
```

Objects have **static binding** by default in cpp. For **dynamic binding**, methods must have the `virtual` keyword.
static binding by default does offer better performance.

Derived classes can also use the keyword `override` to ensure it's base class overloads are `virtual`.

> If a class has at least one virtual method, then it should also have a virtual destructor.

### Abstract Classes

Abstract classes have at least one pure virtual method.

```cpp
virtual void attack() = 0;
```

## Multiple Inheritance

Should always be done with interfaces. All (or at least most) methods should be pure virtual with ideally no member variables.

## Copy Semantics

```cpp
Point p(2, 3);
Point q = p;
```

> Makes a bitwise copy of p to q.

This is troublesome if an object contains pointers, or worse, to heap memory. Only the pointer gets copied so we will get two pointers to the same piece of data as oppose to copying the data.

### Pass by Value/Reference

It's generally best to pass by reference but why is this the case?

- Saves of memory since you're just using an alias for the same memory location.
- Passing by value does a bitwise copy which can be slow but also may have unintended issues.
- Pass by reference let's us change the value directly.
- Even if we don't want to, we can enforce `const` to avoid changing the original.

## Initialization

You can use initializer lists to assign parameters before the constructor is run. Allows you to assign to const member variables as they can't change after initialization.

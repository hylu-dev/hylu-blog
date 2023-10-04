---
title: "C++ a Personal Guide"
date: 2023-10-04T13:05:14-04:00
draft: false
cover:
    image: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230703144619/CPP-Language.png"
tags: ["c++"]
---

A compilation of various features and gotchas I've encountered while studying C++.

## When to Use Initializer Lists

Intializer lists offer a secondary method of initializer member variables for a class. A question comes up of why would we use this method as opposed to initializing the variables on declaration of just in the constructor. Below are a few core purposes.

### Initialize Const Members

You could initialize these on declaration but what if you we want to pass in their values as arguments to the constructor. Okay, then we can move it to the constructor. Nope, it's a `const` variable so it can't be modified.

Initializer lists let's us instantiate `const` variables as with arguments before they can't be modified.

```cpp
class Test {
    const int t;
public:
    Test(int t):t(t) {}  //Initializer list must be used
    int getT() { return t; }
};
```

### Call a Parent Constructor

If you're deriving from a base class, you may want to initialize those base class members with it's constructor.

```cpp
class A {
    int i;
public:
    A(int );
};
 
A::A(int arg) {
    i = arg;
    cout << "A's Constructor called: Value of i: " << i << endl;
}
```

```cpp
class B {
    A a;
public:
    B(int );
};
 
B::B(int x):a(x) {  //Initializer list must be used
    cout << "B's Constructor called";
}
```

> <https://www.geeksforgeeks.org/when-do-we-use-initializer-list-in-c/>

## Stack and Heap Memory

### Declaring Data Structures on the Heap

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

### Dangling Pointers on the Heap

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

### Dangling Pointers on the Stack

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

#### Difference With Uninitialized Variables

An uninitialized variable is generally a bad idea

`int x;`

If you dereference it, you could get anything depending on whatever was left there in memory. This is not as bad as the aforementioned *dangling pointer* though as at least that memory block is being used by `x` so it won't be used later down line until `x` is released.

```cpp
int x;
```

### Memory Leaks

If you allocate some memory on the heap, you should always have a pointer leading to it. If you lose those pointers, than you'll have no way of accessing that memory.

That is, **you won't ever be able to free that memory**.

## Double Pointers and Arrays

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

## Iterators

### Classic Iteration

The classic example of iteration is just a normal for loop for you start from an int and increment by 1 until you arrive at the end

```cpp
for (int i = 0; i < 10; i++) {
    std::cout << "Hello World!";
}
```

This works well for an integer index but it gets more interesting if we want to iterate over a data structure. We want to be able to go through each index of a data structure by accessing the correct memory address.

In case of an array or vector, we can do so by incrementing the memory address since the array holds data in a **contiguous** fashion (each memory address is adjacent to the next). So we can loop using an incrementing pointer like follows.

```cpp
int[5] nums = {1, 2, 3, 4, 5};
int* ptr = nums; //stores address of the first element
for (int i = 0; i < 5; i++) {
    std::cout << *ptr;
    ptr++; //increments the memory address by sizeof(int)
}
```

### Non-Continguous Iterating

Data structures don't always store data contiguously. Something like a `list` acts as a container for each value added to it. Then, links each container with a pointer to the correct memory address. Iterating this requires manually following the cookie crumbs of memory addresses until you get to the index you were looking for.

Instead of needing to do that manually, many of these data structures offer their own **iterators** that handle the work needed to get to the next index of a data structure. Most data structures let you extract the iterator with the following syntax.

```cpp
std::list<int>::iterator it;
```

you an then use that iterator traverse the data structure as you please.

```cpp
std::list<int> myList = {1, 2, 3, 4, 5};

// Using an iterator to traverse the list
std::list<int>::iterator it;
for (it = myList.begin(); it != myList.end(); ++it) {
    std::cout << *it << " "; // Dereferencing the iterator to access the element
}
```

### Iterator Random Access

The list data structure only allows bi-directional iteration but doesn't allow you to immediately access a particular index as it needs to follow the trail of memory addresses to find it.

Something like a `vector` does allow immediate indexing so you can use the iterator to increment the data pointer by index. In this case, you can also use the typical array-indexing syntax and it will automatically use the iterator for random access as needed.

```cpp
std::vector<int> myVector = {1, 2, 3, 4, 5};

// Using a random access iterator to access elements
std::vector<int>::iterator it = myVector.begin();

// Accessing elements at specific positions
std::cout << "Element at index 2: " << *(it + 2) << std::endl;
std::cout << "Element at index 4: " << *(it + 4) << std::endl;

// Using the [] operator for random access
std::cout << "Element at index 3: " << myVector[3] << std::endl;

return 0;
```

### Using Range Based Loops

Starting from C++11, range-based for loop are provided, to iterate over elements with a simpler syntax.

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

// Using a range-based for loop to iterate over elements
for (auto& num : numbers) {
    std::cout << num << " ";
}

return 0;
```

#### Auto

> <https://stackoverflow.com/questions/29859796/c-auto-vs-auto>

- Use `auto &&` for the ability to modify and discard values of the sequence within the loop. (That is, unless the container provides a read-only view, such as `std::initializer_list`, in which case it will be effectively an `auto const &`.)
- Use `auto &` to modify the values of the sequence in a meaningful way.
- Use `auto` const & for read-only access.
- Use `auto` to work with (modifiable) copies.

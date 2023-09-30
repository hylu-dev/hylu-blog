---
title: "C++ Iterators"
date: 2023-09-30T12:41:58-04:00
draft: false
cover:
    image: ""
tags: ["c++"]
---

## Classic Iteration

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

## Non-Continguous Iterating

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

## Iterator Random Access

The list data structure only allows bi-directional iteration but doesn't allow you to immediately access a particular index as it needs to follow the trail of memory addresses to find it.

Something like a `vector` does allow immediate indexing so you can use the iterator to increment the data pointer by index. In this case, you can also use the typically array-indexing syntax and it will automatically use the iterator for random access as needed.

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

## Using Range Based Loops

Starting from C++11, range-based for loop are provided, to iterate over elements with a simpler syntax.

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

// Using a range-based for loop to iterate over elements
for (auto& num : numbers) {
    std::cout << num << " ";
}

return 0;
```

### Auto

> <https://stackoverflow.com/questions/29859796/c-auto-vs-auto>

- Use `auto &&` for the ability to modify and discard values of the sequence within the loop. (That is, unless the container provides a read-only view, such as `std::initializer_list`, in which case it will be effectively an `auto const &`.)
- Use `auto &` to modify the values of the sequence in a meaningful way.
- Use `auto` const & for read-only access.
- Use `auto` to work with (modifiable) copies.

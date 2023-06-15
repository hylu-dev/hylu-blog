---
title: "Intro to Deep Learning"
date: 2023-06-12T17:22:24-04:00
draft: false
cover:
    image: "https://thedatascientist.com/wp-content/uploads/2015/12/cool_neural_network.jpeg"
math: true
mermaid: true
tags: ["ai"]
category: ["Development"]
---

### Neural Networks

See Machine Learning

How do you decide how many neurons to use per layer?
> One way is to start with all layers uing the same amount of neurons and continue adding them until they start overfitting the data

- **Dropout**: Regularlization technique to avoid overfitting. Leaves out data to better deal with general cases. 20%-50% dropout is a good starting range.
- **Momentum**: Helps finding the direction of next descent and prevent oscillations. Typical choice between 0.5 to 0.9
- **Epochs** #times the whole training data is shown to netowrk during training. 1 epoch = one forward and one backward pass of all training data

### Back Propagation

See Machine Learning

Using the gradient (slope) of the cost function, we take steps down the slope through multiple learning iterations in order to find some local minima to the cost. Ideally leading to a high accuracy model.

### Common Problems

#### Overfitting

Model gets too comfortable with the test set and becomes less able to classify data outside of it.
Accuracy improves, validation (outside data) worsens.

#### Vanishing Gradients

Gradients often get smaller as back propagation moves to lower layers (closer to start input). Can result earlier layers being virtually unchanged
Result

- Training doesn't converge to a good solution
- Prevent network from learning long term dependencies

#### Exploding Gradients

Gradients get too large and algorithm starts to diverge.

### Stabilizing Gradients

Techniques to avoid and remedy problems such as the aforementioned.

#### Batch Normalization

Normalize the layers inputs (recenter and scale to a normal distribution) at each given layer

- Can remove the need of normalizing your inputs
- Adds complexity to model as well as runtime penality

#### Gradient Clipping

Clamps every component of the gradient vector to [-1.0, 1.0]

### Regulariation

Methods to avoid overfitting data

#### L1 & L2 Regularization

Both these methods involve adding another term to the cost function that increases the cost as complexity of the model increases. Typically done before activation.

**L1**: Used in Lasso Regression adds an absolute value value of weights. This linearly increases cost of certain features and unimportant costs will eventually converge to zero, effectively reducing our relevant feature set.

**L2**: Used in Ridge Regression adds the sum of squares weights. This increases the cost of features down to near but not quite zero. Doesn't remove complexity as effectively but can better retain accuracy of the model.

### Dropout

Every training step, any neuron has a chance of being left out and ignored for that training step. Reduces model complexity and avoid picking up too much noise. Typically set at 50%.

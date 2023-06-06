---
title: "Intro to Machine Learning"
date: 2023-05-28T21:17:51-04:00
draft: false
cover:
    image: "https://img.freepik.com/premium-vector/machine-learning-banner-web-icon-set-data-mining-algorithm-neural-network_35632-107.jpg?w=2000"
math: true
mermaid: true
tags: [""]
category: [""]
---

In preparation for a deep learning course I'm taking over the Summer, I'm taking a short [intro course on machine learning](https://www.youtube.com/watch?v=i_LwzRVP7bg) to help prepare me for some of the fundamental concepts.
I've been avoiding AI for a while but given its ongoing application in nearly everything now, I figure it's more than worth getting my feet wet.

{{< toc >}}

## ML Overview

{{< mermaid >}}
flowchart LR
    subgraph Shader Lifecycle
    direction LR
        d[("Dataset")] --> m(("Model")) --> o("Predicted Values") ---|compare with| a("Actual Values") -->|calculate| l["Loss"]
        l -->|training data| m
    end
{{< /mermaid >}}

### Loss Functions

When we compare our predicted results to the actual results, how do we calculate the loss?

Loss functions can vary but they can be as simple as calculating the difference.

$$loss = sum(|y_{real} - y_{predicted}|)$$

$$loss = sum((y_{real} - y_{predicted})^2)$$



### Datasets

- Training Set: Data to train the model
- Validation Set: Data that the model has not seen to ensure model can handle unseen data
- Testing Set: Data to test the model (seen or unseen)

### Types of Machine Learning

- **Supervised Learning** - Using labelled input data to train models, e.g. inputting animal pictured labelled with the coorresponding animal names.
- **Unsupervised Learning** - Using unlabelled input data to learn about pattern in data, e.g. inputting unlabelled animal pictures and having your machine try to group them
- **Reinforcement Learning** = Agent learning in an environment based on rewards and penalties

## Supervised Learning

With a supervised dataset, you have a bunch of sampled data that each have an **output label** that classifies that data sample, as well as having 1 or more **features** which are just information about that subject.

For example you may be sampling for animals that are dogs, you'd have an output label dictating whether that simple is or isn't a dog as well as features of the sample like their weight, size, and color.

We call the set of features the **feature vector**. We call the output label the **target**

![ML Type Difference](https://i0.wp.com/www.sharpsightlabs.com/wp-content/uploads/2021/04/supervised-learning-data_vs_unsupervised-learning-data.png)

## Machine Learning Models

Once we have our data that we want to perform machine learning on, we need to decide on the model we use to classify new, unlabelled data.

### K-Nearest Neighbours (KNN)

![KNN](https://miro.medium.com/v2/resize:fit:828/0*jqxx3-dJqFjXD6FA)

The intuition here is we have a labelled dataset, if get a new point in the dataset, we can infer how it should be labelled based on it's distance from other points.

More formally, we take \\(K\\) of the nearest data points to our new point and based on the most common label, we infer the label of our new point. We can choose any number of \\(K\\) and depending on our dataset, can have varying levels of effectiveness.

### Naive Bayes

Recall Bayes Theorem

$$
\def\series{x_1, x_2,..., x_n}
P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$

Naive Bayes is a generalization of this formula for a series of evidence.

For some category \\(C_k\\) (e.g. cats, dogs, etc.) and evidence \\(\series\\) (furry, red, small, etc.)

$$
P(C_k|\series)\ \alpha\ \Pi_{i=1}^n P(x_i|C_k)P(C_k)
$$

- Our **target** acts as the category \\(C_k\\)
- Our **feature vector** act as the evidence \\(\series\\)

> Derivation step for reference
$$
P(C_k|\series)\ = \frac{P(\series|C_k)P(C_k)}{P(\series)}
$$
Notice we remove the demoninator from Bayes Theorem. Since it isn't influenced by \\(C_k\\), it acts as a constant. In following, \\(\alpha\\) stands for proportional since they are no longer equal.

**But how do we use Naive Bayes to classify data?**

$$\hat{y}\ (predicted\ category) = argmax_k P(C_k|\series)$$

We want to find the category that maximizes the probability given by the Naive Bayes. Essentially, we'll be running Naive Bayes on each category and compare the categories that returns the highest probability.

> Notice why Naive Bayes works despite only being a proportional value. We only want to compare probabilities, we don't actually need the probability itself.

### Logistic Regression

![Logistic Regression](https://builtin.com/sites/www.builtin.com/files/styles/ckeditor_optimize/public/inline-images/3_logistic-regression-classification-algorithm.png)

### Support Vector Machines

![Support Vector Machine](https://miro.medium.com/v2/resize:fit:1400/1*ZpkLQf2FNfzfH4HXeMw4MQ.png)

## Neural Network

For more complex data, modern approaches have been using neural network models.

### Gradient Descent
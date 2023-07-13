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

{{< toc >}}

## Neural Networks

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

## Convolutions

Analying images is a complex matter for machine learning as our feature vector scales with the number of pixels in our image. If we were to directly use those inputs, we are likely to get a highly overfit model with very long training times.

> The role of ConvNet is to reduce the images into a form that is easier to process, without losing features that are critical for getting a good prediction. This is important when we are to design an architecture that is not only good at learning features but also scalable to massive datasets. - <https://saturncloud.io/blog/a-comprehensive-guide-to-convolutional-neural-networks-the-eli5-way/>

### Convolution Operation in 1D

The standard operation in 1D works as follows:

Let's take two arrays

$$A = [\textbf{5,3,7},5,9,7]$$
$$B = [1,2,3]$$

We then we take the elements in B and multiply it by the first n elements in A where n is the length of B. We then sum up the values.

$$A\cdot B = 5\cdot 1 +  3\cdot 2 + 7\cdot 3 = 17$$

We then slide our choice of n elements by 1 and repeat the operation.

$$A = [5,\textbf{3,7,5},9,7]$$
$$B = [1,2,3]$$

$$A\cdot B = 3\cdot 1 +  7\cdot 2 + 5\cdot 3 = 22$$

We then repeat this operation until our choice of n elements reaches the end, giving the following convoluted array.

$$A\times B = [17, 22, 39, 44]$$

Notice the length of our convoluted array is \\(len(A)-len(B)+1\\)

### Convolutions in 2D (Images)

The operations for 2D is largely the same, the difference being we are now operating on matrices.

We take the matrix of the pixels in our original image and multiply it by a filter matrix known as a **kernel**. The output of the convolution is known as the **feature map**.

$$
\begin{bmatrix}
1&0&1\\\\
0&1&0\\\\
1&0&1
\end{bmatrix} 
$$

> Filters can be configured as any combination of 1's and 0's. For example, you might have one filter of a vertical line and another with a horizontal line. A vertical filter would blur the horizontal features of the image and similarly vice versa. Imagine how choosing specific filters can allow your feature map to focus on specific details of your image.

As we slide our kernel across the pixel array, we must move across the vertial and horizontal pixels to cover the whole image.

{{< img src="https://d33wubrfki0l68.cloudfront.net/bd7d4b44eee0adfc2a64a6bf35c2e058e25b5aa2/38785/images/blog/convoluting-a-5x5x1-image-with-a-3x3x1-kernel-to-get-a-3x3x1-convolved-feature.gif" >}}

### Building a Convolutional Network with TensorFlow

#### Prepare the Input Data

Convolutional networks are most commonly used for image analysis so we want to prepare our data as a 2D array of pixels. The dimensions of our data will depend on the **dimensions** of the image, the **colour channels**, the numbers of **classifiers**, as well as how many **samples** we have.

```py
# we are using mnist in which which we have 10 digit classification
num_classes = 10
# input image dimensions
img_rows, img_cols = 28, 28
# colour channels, in this case we're using b/w images
num_channels = 1

# the data, split between train and test sets
(X_train, y_train), (X_test, y_test) = mnist.load_data() # returns numpy arrays
# 80/20 training and validation set
(X_valid, y_valid) = X_train[:12000], y_train[:12000]  
X_train, y_train = X_train[12000:], y_train[12000:]
# Shape of X_train: (60000, 28, 28)
# Shape of y_train: (60000,)
```

Here we do some shaping of our arrays to better used in our model.

```py
# numpy reshape from array of 2D arrays to array of 3D arrays
# The first dimension is the number of samples in our dataset, the other 3 are the image dimensions, we add another dimension for the colour channels
X_train = X_train.reshape(60000, img_rows, img_cols, num_channels) 
X_test = X_test.reshape(10000, img_rows, img_cols, num_channels)

# Converts our y_train from a 1D vector to a 2D matrix
# Before our y_train contains 60000 truth samples from 0-9
# Now it contains 60000 vectors of size <num_classes> where instead of containing the number explicitly,
# the number is one-hot encoded into the indices
# Ex. 4 would now be encoded [0,0,0,1,0,0,0,0,0,0] in the matrix
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)
```

#### Constructing the Model

Creating the model is straight forward and involves setting hyperparameters depending on how we want to tune our training.

```py
model = Sequential()
model.add(
    Conv2D(
        filters=4, 
        kernel_size=(3, 3),
        activation='relu', 
        input_shape=(img_rows, img_cols, num_channels)
    )
)
model.add(Conv2D(1, (3, 3), activation='relu'))
# apply max pooling to downsize the output by a factor of 2
model.add(MaxPooling2D(pool_size=(2, 2)))
# apply dropout for regularization
model.add(Dropout(0.25))
# flatten the output features to perform standard softmax classification
model.add(Flatten())
# the dense layer learns the 'classification' part of our task
model.add(Dense(128, activation='relu'))
model.add(Dense(num_classes, activation='softmax')) # output layer
```

### Compiling the Model

```py
batch_size = 128
epochs = 10

model.compile(
    loss=keras.losses.categorical_crossentropy,
    optimizer=keras.optimizers.Adam(),
    metrics=['accuracy']
)

history = model.fit(
    X_train, 
    y_train,
    batch_size=batch_size,
    epochs=epochs,
    verbose=1,
    validation_data=(X_valid, y_valid)
)
score = model.evaluate(X_test, y_test, verbose=0)

print('Validation loss:', score[0])
print('Validation accuracy:', score[1])
```

### Transfer Learning

Datasets are integral to the success of a neural network but often there just isn't big enough datasets that exist for every problem. In the case of images, trying to build a model to classify a niche subject matters can be difficult without ample data.

**Transfer learning allows us to use some or all of pre-trained models and iterate over them to create models**. Many fantastic image models have already been professionally built across many talented minds so it's advantageous to piggy back off of them.

**But how is someone elses model useful if we're trying to solve a niche problem?** Early layers in neural nets are more generalized in the features they pick up and become more and more fine tuned the deeper the net goes. **We can leverage the earlier layers in an existing model** that's well trained to classify broad shapes in images and *freeze* the remaining layers and instead use our own layers that are trained to more specifically classify those shapes in the way we want. That's the general idea.

**VGG16** is one such powerful neural net for image recognition we can leverage in our own model.

```py
# VGG16 pre-trained model without fully connected layers and with different input dimensions
image_w, image_h = 180, 180
model = tf.keras.applications.VGG16(weights = "imagenet", include_top=False, input_shape = (image_w, image_h, 3))

# We freeze several layers in VGG16 to avoid training them
for layer in model.layers[:17]:
    layer.trainable = False
```

We can preprend a new model with the existing model and add our own layers for training.

```py
new_model = Sequential([
    model,
    Flatten(name='flatten'),
    Dense(260, activation='relu', name='new_fc1', kernel_initializer="HeNormal"),
    Dense(100, activation='relu', name='new_fc2', kernel_initializer="HeNormal"),
    Dense(5, name='new_predictions')
])

new_model.compile(
    loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    optimizer = tf.keras.optimizers.Adam(lr=0.01),
    metrics=["accuracy"]
)
```

Sometimes it can be advantageous to freeze all of the layers of the pretrained to avoid overfitting, especially if we have a small dataset. As always, finding methods to the madness in a neural network is highly involved with trial and error and constant comparison.

## Deep Computer Vision

Computer vision is the field of computer science dedicated to enabling computers to understand images and videos.

### Object Classification and Localization

TBeing able to identift specific objects within an image frequently used in a variety of technological applications. For example, face filters need to identify where human faces and specific features are. This can become compilicated as any single picture can have a variety of sizes, aspect ratios, colours, and objects of the interest the computer needs to filter through in order to identify an object.

A simple model involves training a network to identify an object in an image by outputting a bounding box at the desired location. For identifying a single object, this is a fairly simple task

First we acquire a dataset of images with box labelling

```py
# Construct a tf.data.Dataset
ds_train = tfds.load('voc/2012', split='train', shuffle_files=True)
ds_test, ds_validation = tfds.load('voc', split=['test','validation'], shuffle_files=True)
```

This particular dataset has lot's of components as shown below

```py
print(ds_train.take(1)) # creates a new dataset with a max size of 1

> <_TakeDataset element_spec={'image': TensorSpec(shape=(None, None, 3), dtype=tf.uint8, name=None), 'image/filename': TensorSpec(shape=(), dtype=tf.string, name=None), 'labels': TensorSpec(shape=(None,), dtype=tf.int64, name=None), 'labels_no_difficult': TensorSpec(shape=(None,), dtype=tf.int64, name=None), 'objects': {'bbox': TensorSpec(shape=(None, 4), dtype=tf.float32, name=None), 'is_difficult': TensorSpec(shape=(None,), dtype=tf.bool, name=None), 'is_truncated': TensorSpec(shape=(None,), dtype=tf.bool, name=None), 'label': TensorSpec(shape=(None,), dtype=tf.int64, name=None), 'pose': TensorSpec(shape=(None,), dtype=tf.int64, name=None)}}>
```

Some of the important components include

- **image**: An image tensor
- **labels**: The label for the image
- **bbox**: The bounding box of object in this sample.
  - bbox[0]: \\(l\\) from top bound to top edge of box
  - bbox[1]: \\(l\\) from left bound to left edge of box
  - bbox[2]: \\(l\\) from top bound to bottom edge of box
  - bbox[3]: \\(l\\) from left bound to right edge of box

Next we section off our dataset for training

```py
# Map our dataset to just the image, label, and bounding box and form into batches of 32 for training
ds_train_image = ds_train.map(lambda a: (tf.image.resize(a['image'], [300,300]), (a['objects']['label'][0], a['objects']['bbox'][0]))).batch(32)
ds_test_image = ds_test.map(lambda a: (tf.image.resize(a['image'], [300,300]), (a['objects']['label'][0], a['objects']['bbox'][0]))).batch(32)
ds_validation_image = ds_validation.map(lambda a: (tf.image.resize(a['image'], [300,300]), (a['objects']['label'][0], a['objects']['bbox'][0])))
```

Create the model

```py
# We start with the Xception model (71 layers) as well with pre-trained weights (transfer learning)
base_model = tf.keras.applications.Xception(weights="imagenet", include_top=False)
# Teras model functional API https://keras.io/guides/functional_api/ as opposed to sequentially adding layers
avg = tf.keras.layers.GlobalAveragePooling2D()(base_model.output)
avg = tf.keras.layers.Dense(200, activation="relu")(avg)

n_classes = 20
optimizer = tf.keras.optimizers.Nadam(learning_rate=0.00001)

class_output = tf.keras.layers.Dense(n_classes, activation="softmax",name="class")(avg)
loc_output = tf.keras.layers.Dense(4, name="loc")(avg)
model = tf.keras.Model(inputs=base_model.input,
                    outputs=[class_output, loc_output])

# Freeze layers from training
for layer in model.layers[:110]:
  layer.trainable = False
for layer in model.layers[110:]:
  layer.trainable = True

model.compile(loss=["sparse_categorical_crossentropy", "mse"],
              loss_weights=[0.1, 0.9], # depends on what you care most about
              optimizer=optimizer, metrics=["accuracy"])
model.summary()
model.fit(ds_train_image, epochs=50, validation_data=ds_test_image)
```

### Multiple Object Classification

Things become much more complicated when you want your model to identify multiple objects witin a given image. Different bounding boxes are needed with their associated locations and dimensions.

#### Sliding Window Method

A naive approach involves sliding a bounding box across the image and having the model identify the bounding boxes that identify an object. This is computationally expensive as we need to consider differing box dimensions.

{{< img class="img-sm" src="https://developers.arcgis.com/python/guide/images/slidingwindow.gif" >}}

#### Single Shot Detector

WHY DO WE NEED TO FLATTEN LAYERS (LOOK INTO THIS)

## Recurrent Neural Networks

These are a special type of neural net designed to work for a sequence of data. Normally each set of inputs are independent from eachother but there are needs for them to depend on each other such as sequences of words or sounds. The main difference is that we feed our output back into the next set of inputs and keep a concept of "memory" in our net.

### Unfolding Layers

Unfolding is a terminology to describe a very simple process. Examining a recurrent layer over multiple timesteps. Rather than showing one recurrent network, we show it as multiple networks that feed into eachother to create that recurrent behavior. This makes it easier to see how our recursion occurs as well as how backpropagation occurs.

{{< img src="https://machinelearningmastery.com/wp-content/uploads/2021/09/rnn1-1536x726.png">}}

### Backpropagation in Time (BPTT)

Our normal backpropagation algorithm is updated for use in RNN's.

- choose \\((k\\)) time steps for training
- Propagate through unfolded network for \\(k\\) time steps compute output at all timesteps
- Calcualte error as: \\e = (y_{t+k} - p_{t+k})
  - \\(y\\) is our output \\(p\\) is our target output at the time step
- Backpropagate the error across unfolded network and update weights.

## Natural Language Processing (NLP)

The computational treatment of human language. Many large datasets of text exist for training known as a *corpus* that are large, structured sets of text for machine learning.
Generally, the process of creating an NLP model requires a lot of preprocessing of your training text and figuring which method of text chunking and labelling best suits the model you want.

{{< img class="img-sm" src="https://www.researchgate.net/profile/Kim-Schouten/publication/318138528/figure/fig4/AS:667674447204357@1536197401651/The-NLP-pipeline-used-at-the-basis-of-the-methods-features-compared-to-the-number-of.png">}}

### Common Problems

- Ambiguity: The same sentence can have multiple meanings
- Synonyms and Homonyms
- Mispellings
- Sarcasm
- Allegory
- Dialects

### Tokenization

A strategy to deal with complex sentences is to break it up into smaller chunks. Most often this simply by splitting the word by whitespace (1 word 1 token). You may also decide to drop any punctuation to simplify the problem at the cost of some understanding.

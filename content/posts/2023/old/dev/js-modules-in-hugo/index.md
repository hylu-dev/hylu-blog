---
title: "JS Modules in Hugo"
date: 2023-07-14T07:57:33-04:00
draft: false
cover:
    image: "https://discoverthreejs.com/images/logo/banner_trans.png"
tags: ["development"]
---

While writing this blog, I've been constantly finding a need to include various JavaScript libraries such as graphics libraries or text processors. I love the simplicity of Markdown but sometimes it can be really helpful to include more meaningful content and visuals to better illustrate a certain topic or idea.

My most recent endeavor was adding an easy way to render shaders within each of posts which turned out to be a more painful task than I originally anticipated. Here, I hope to document some of my process of importing modules and hopefully make it easier for whoever is reading to import modules into their own Hugo blog.

## Core Hugo Features to Know

### Themes

Themes are essentially, a set of prebuilt pages, partials, and shortcodes created by other developers for you to use. Each theme has its own page templates that change the way the site and any posts look as well as theme specific features like breadcrumbs and indexing.

Hugo is designed to be highly extensible and easy for you to add these features or design yourself but using a pre-built theme just saves you a lot of work. Instead, your best bet is to choose a theme and extend or override files in that theme as you need.

the theme will explicitly sit inside a `themes` folder and inside you may notice, it has a similar directory structure to your main directory

```c
// This is a condensed version of items you may find in your Hugo directory
- assets
- images
- layouts
themes
 - ThemeX
    - assets
    - images
    - layouts
        - partials
        - shortcodes
```

Some of these directories will be seemingly clones of your original. This the beauty of Hugo's themes. To edit a file in a theme, just copy the file from that theme directory into the corresponding directory in your root directory and edit the file directly. Hugo will prioritize using files in your directory rather than a theme. Any files added that are not in your theme will just be new files added on top of the theme.

### Shortcodes

Depending on what kind of module your importing, you may or may not need a shortcode. A shortcode is just syntatic way to cleanly inject any html into the middle of your Markdown.

> layouts > shortcodes > html.html
```html
<div class="html-block">{{.Inner}}</div>

<style>
    .html-block {
        display: block;
        width: 100%;
        margin: 1rem 0;
    }
</style>
```

I can then use this in my markdown to drop in pure html in my posts. This may not be good practice, but this is my blog and I have the freedom to do so.

```md
{{</* html */>}}
    <small style="color: magenta;">Hello!</small> 
{{</*/ html */>}}
```
{{< html >}}
    <small style="color: magenta;">Hello!</small> 
{{</ html >}}

You may notice the use of handle bar notation in the above code. You're also given access to some additional syntax with Go templating for more entry points into Hugo's features. In this case, I'm just using `{{.Inner}}` to grab the text placed within the shortcode and rerending it out between a `<div></div>`.

### Partials

You can think of partials as components in a framework like React. They are bits of HTML and Go templating that can be added directly into the base page template.

Let's say you wanted to add a custom signature at the bottom of all your pages, you can create that signature in a partial and then add that partial directly into your page templates.

## Importing a JS Module

As mentioned before, we don't want to load our module globally so instead, we will try to only load the module inside the specific post. To keep things simple and avoid cluttering your directory, we will depend on CDN's to serve the JS that we want.

At first, you might try to grab the JS library in a script tag add it to your template.

```html
<script src="https://<host>/three.js/0.154.0/three.min.js"></script>
```

This way all js on the page has access to the library and our JS can look like this:

```js
import * as THREE from 'three';
```

This may work but we'll need to create our JavaScript file in every single one of our posts and call it in every one. Ideally, we would like our JS to be in one place and called from every posts that needs it. Naively, we may try placing our JS inline inside our partial or even shortcode but we'll very quickly be met with the message `import declarations may only appear at top level of a module`.

Instead, we'll try to grab our JS globally from our `/assets` directory.

### Creating a Front Matter Param

To start, we want to be able to optionally enable our import for each post. We can simply do this by adding a `.Params` check in the header of our post template for whether the `shader` parameter is true. If so, we'll insert a partial which will then add our module.

```go
<!-- Import threeCanvas module -->
{{ if (.Params.shader) }}
{{ partial "shader.html" }}
{{ end }}
```

Now in our post, we can simply enable it in our **front matter**

```yml
---
title: "Hello World"
date: 2023-01-01
draft: False
shader: true
---
```

### Creating our Import Partial

Here we use a bit of a tricky syntax courtesy of [Hugo Pipes](https://gohugo.io/hugo-pipes/introduction/) to process files in our assets directory. Regis Philibert has a great [post](https://www.regisphilibert.com/blog/2018/07/hugo-pipes-and-asset-processing-pipeline/) that goes more in-depth on the pipes feature.

```go
{{ $script := resources.Get "js/script.js" }}
{{- $globalJS := $script | resources.Minify | fingerprint -}}

<script type="module" async src="{{ $globalJS.Permalink }}" integrity="{{ $globalJS.Data.Integrity }}"></script>
```

What happens here is that we grab our script at `assets/js/script.js`, do some extra processing like minification, and then use `.Permalink` to create a visible link for our script to import the module from.

### All That's Left is to Use It

Now that we're able to run our `asset/script.js` while inside our post, we can now proceed to write the JS module itself.

```js
import * as THREE from 'https:<host>.three.module.min.js';

// The rest of the script...
```

Then, for whichever post you'd like the module to run, just set the front matter param to true and your module will be imported!

```yml
shader: true
```

In my case, my module loads shaders by query selecting for an `HTMLElement` with class `.three-container`. I've created another shortcode to generate that html.

The result for me is a nice shortcode that allows to me easily render shaders within a blog post such as the below.

{{< tiles >}}
{{< shader size="300" >}}
<script class="fragment-file" type="x-shader/x-fragment">
shaders/swirl.frag
</script>
{{</ shader >}}

{{< shader size="300" >}}
<script class="fragment-file" type="x-shader/x-fragment">
shaders/grid-squares.frag
</script>
{{</ shader >}}
{{</ tiles >}}
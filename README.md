# My Personal Blog

A website for my projects and other ongoings. Created with Hugo and a modified PaperMod Theme.

Custom Features Include:
 - Mermaid | In-Post Charts
 - MathJax | In-Post LaTeX Math Rendering
 - ThreeJS | In-Post 3D WebGL Rendering
 - Featured Posts with Project Links
 - Badges and Element Tiling
 - Responsive Styles
 - More!

## Pull the main repo

```bash
git clone <repo>
```

## Pull paper mod submodule

```bash
git submodule update --init
```
## Start development server

```bash
hugo server -D
```

## Optimizing images

Images in page bundles are resized into a WebP `srcset` at build time (`layouts/partials/media.html`), so commit one full-size still image and let Hugo handle the rest.

Animated images are much smaller as video. Run the script below after adding media. It turns each animated WebP into `<name>.mp4` and replaces the `.webp` with a still of its first frame. The templates play the `.mp4` automatically, so markup doesn't change. Requires `ffmpeg` and the `webp` tools.

```bash
scripts/optimize-media.sh --dry-run   # preview savings
scripts/optimize-media.sh             # convert (content/ by default, or pass paths)
```

---
title: "Handling Normals from Unity to Blender"
date: 2023-05-15T14:34:17-04:00
draft: False
cover:
    image: https://docs.blender.org/manual/en/2.79/_images/modeling_meshes_editing_normals_viewport.png
---

While trying to import a plane from Blender to Unity, I ran into the issue of the normals facing the wrong direction once imported into Unity. This was particularly an issue when it came to vertex shaders as any vertex transform performed incorrectly.

This crux of the issue is that Blender considers the z-axis to be the vertical axis while unity considers the y-axis to be. So, for a plane in Blender, the normals would face towards the positive z-axis but when imported to Unity, they remain so which to Unity is actually along the horizontal plane. Oddly, the actual model imports in the correct orientation, it's just the normals that don't adjust after import (which creates the mismatch problem of normals not facing the right direction. If the whole mesh and normals rotated equally, that'd be fine).

At the moment, I don't have the best understanding of the solution but turns out when exporting as a .fbx, there's an *"apply transform"* option that bakes the transforms into the model before importing. This fixes the issue. I'll take a look this again another time, but for now this will be my goto solution.

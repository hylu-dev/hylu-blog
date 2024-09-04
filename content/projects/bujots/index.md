---
title: "Bujots: Jot-Based Journals"
date: 2024-06-24T06:26:40-04:00
draft: false
cover:
    image: "https://raw.githubusercontent.com/hylu-dev/bujots/main/demo.png"
tags: ["development"]
mermaid: true
socialIcons:
    - name: "github"
      url: "https://github.com/hylu-dev/bujots"
---

> **Bujots** - *"boo-jots": /buˈʒɒts/*
- A portmanteau of bullet journaling and Jots
- A web-based jot note app to create organized online notes

## Jot-Based Journals

The goal of this project is to capture the joy and satisfaction of writing a beautiful journal entry and apply it to jot notes. Along with the ability to write daily notes organized in a timeline, users can freely customize their notes with stickers, adding personality and charm to each one.

{{< badge text="React" icon="react" >}}
{{< badge text="Redux" icon="redux" >}}
{{< badge text="FramerMotion" icon="framer" >}}
{{< badge text="Express" icon="express" >}}
{{< badge text="MongoDB" icon="mongodb" >}}
{{< badge text="TypeScript" icon="typescript" >}}

> https://github.com/hylu-dev/bujots

---

## Features

{{< tiles >}}
    {{< card src="login.gif" >}}
        Login and Registration with OAuth
    {{</ card >}}
    {{< card src="persistence.gif" >}}
        Persistent User Storage
    {{</ card >}}
    {{< card src="sticker.gif" >}}
        Automatic Sticker Formatting
    {{</ card >}}
    {{< card src="autosave.gif" >}}
        Autosaving
    {{</ card >}}
    {{< card src="timeline.gif" >}}
        Timeline Organization
    {{</ card >}}
{{</ tiles >}}

### Journaling Demo

{{< video src="demo.mp4" >}}

## Code Insights

### Frontend

State is managed using Redux slices. For the journal content, a slice is created with reducers that allow us to control updates to the state.

```ts
export const journalSlice = createSlice({
    name: "journal",
    initialState,
    reducers: {
        ...pageReducer,
        ...imageReducer,
        ...stickerReducer,
        resetState: (state) => {
            ... // Reset
        }
    }
})
```

For instance, the page reducer has actions we can use to update the journal pages.

```ts
const pageReducer = {

    addPage: (state: WritableDraft<JournalState>, action: PayloadAction<IPage>) => {
        state.pages = [...state.pages, action.payload]
        state.current = state.pages.length - 1;
    },
    addJot: (state: WritableDraft<JournalState>) => {
        const newPages = [...state.pages];
        newPages[state.current]['jots'].push(emptyJot)
        state.pages = newPages;
    },
    ... // Reducers
}

export default pageReducer;
```

We can then call any of these actions using `useDispatch()`. For instance here, we make a request to the backend to add a page. Only if this request succeeds, do we then dispatch a state update to show the new page.

```ts
// Timeline.ts
...
const dispatch = useDispatch();
const newPage = () => {
    post(`${process.env.REACT_APP_API_URL}/pages/add`, emptyPage, token).then(response => {
      if (response.status === 200) {
        response.json().then((data: IPage) => {
          dispatch(addPage(data));
        })
      }
    });
  }
```

### Backend

#### Document Database

{{< mermaid >}}
erDiagram
    USER {
        string username
        string password
    }
    PAGE {
        string title
        date date
        objectId author
        jot[] jots
        sticker[] stickers
    }
    JOT {
        string text
    }
    STICKER {
        int[2] position
        string image_id
    }
    IMAGE {
        string name
        buffer data
        objectId author
    }

    USER ||--o{ PAGE: "author"
    PAGE ||--o{ JOT: "jots"
    PAGE ||--o{ STICKER: "stickers"
    STICKER ||--o| IMAGE: "image_id"
    IMAGE ||--o| USER: "author"

{{</ mermaid >}}

#### Bujots Endpoints

The backend holds all the API of the app with a whole suite of endpoints organized into the following:

```js
<host-url>/api/auth/*
<host-url>/api/images/*
<host-url>/api/jots/*
<host-url>/api/pages/*
<host-url>/api/users/*
```

For example, we have the following endpoints for `images`

```js
// images.ts
POST | Add Image
GET  | All Images
GET  | One Image
GET  | My Images
DEL  | One Image
```

Let's take a look at `/add` endpoint.

```js
const router = require('express').Router();

router.post('/add', [verifyToken, upload.single('image')], async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    const image = await sharp(file.buffer).resize({
        width: 300,
        height: 300,
        fit: sharp.fit.inside,
    }).trim().png()
    const buffer = await image.toBuffer();

    const newImage = new Image({
        name: `${Date.now()}_image_${file.originalname}`,
        data: buffer,
        author: req.user?._id
    })
    newImage.save()
        .then(((result: IImage) => res.json({ _id: result._id })))
        .catch((err: Error) => res.status(400).json(err))
})
```

When this endpoint is called, we consume the image file from the request and send it through [sharp](https://github.com/lovell/sharp) for some image preprocessing.

We then create a new `Image` document to hold the bytes of the image as well as it's `name` and `author`.
Finally, we save that document into the database.

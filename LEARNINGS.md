# Learnings

Bugs and gotchas hit while building this project, and how they got solved. Newest entries at the top.

---

## Blur bubbles from any focused descendant, not just when focus truly leaves the container

**Date:** 2026-07-25

### Problem
After adding an edit-mode toggle (click the pencil button to unlock an existing note, blur to save and re-lock it), clicking the pencil correctly unlocked the note — but then clicking into the title field to actually start typing immediately saved the note and locked it back to read-only, before any edit had happened.

### Root Cause
`onBlur` was attached to the note's outer wrapping `<div>`, relying on event bubbling to catch a blur from any descendant (title input, content textarea, star button, edit button) losing focus. But blur bubbles regardless of *where* the newly-focused element is going — including when focus simply moves between two elements that are both still inside the same container, like from the edit button to the title input. The handler had no way to tell "focus moved to a sibling field within this same note" apart from "focus left this note entirely," so it treated every internal focus change as "the user is done," saving and re-locking immediately.

A separate thing that slowed down diagnosing this: a `console.log('edit clicked', id)` meant to confirm the edit button's `onClick` was firing had actually been placed inside the `onBlur` handler, not inside the button's `onClick`. It printed on every blur regardless of whether the button was ever clicked, creating a false impression that the click handler was running (and in what order) when it wasn't being observed at all.

### Solution
Added a `ref` (`parentRef`) on the wrapping `<div>` to get a handle on its real DOM node. Inside `onBlur`, read `event.relatedTarget` (the element about to receive focus) and check `parentRef.current.contains(relatedTarget)`:

```js
onBlur={(event) => {
  const nextFocusedElement = event.relatedTarget
  const parentWrapper = parentRef.current

  if (parentWrapper.contains(nextFocusedElement)) {
    return // focus just moved to a sibling field inside this same note — not done editing
  }

  // focus genuinely left the note — save and lock
  handleBlur(id, titleRef.current.value, contentRef.current.value, starred)
  setIsEditable(false)
}}
```

### Lesson
An event handler attached to a container to catch bubbled events from any descendant can't assume "a descendant lost focus" means "the user left the whole container" — moving focus between two children of the same container triggers blur just as much as actually leaving it does. Blur/focus events carry `relatedTarget`, telling you where focus is actually headed; combined with `Node.contains()` on a ref to the container, that's how you distinguish "still inside" from "genuinely left."

Separately: when adding a diagnostic `console.log` to confirm a specific handler is firing, double-check it's physically inside *that* handler and not a neighboring one — a log with a plausible-sounding name can still create a completely false picture of what's actually running and in what order.

---

## A backend endpoint requiring several fields together silently breaks if the UI only sends one

**Date:** 2026-07-23

### Problem
Saving a note's title/content via `PUT /notes/:id` was crashing on the server with a `500`, even though the request looked correct from the client.

### Root Cause
The `updateNote` model always writes all three columns unconditionally:
```js
db.prepare(`UPDATE notes SET title = ?, content = ?, starred = ? WHERE id = ?`).run(title, content, starred, id)
```
The client's `onBlur` handler was only passing `id`, `title`, and `content` — never `starred` — because it was available as a prop but simply not included in the call. That made `starred` `undefined` inside `saveNote`.

Two compounding facts made this fail silently until it hit the server:
1. `JSON.stringify({ ..., starred: undefined })` **drops keys whose value is `undefined` entirely** — the outgoing request body didn't even contain a `starred` field, so nothing about the request itself looked obviously wrong.
2. `better-sqlite3` throws (`TypeError: SQLite3 can only bind numbers, strings, bigints, buffers, and null`) the moment it's asked to bind `undefined` — so the failure only surfaced once the request reached the database layer.

### Solution
Threaded `starred` all the way down the prop chain (`NotesLayout` → `Note`) and included it explicitly in the `onBlur` call: `handleBlur(id, titleRef.current.value, contentRef.current.value, starred)`.

### Lesson
If an update endpoint's SQL always sets several columns together, every caller must supply all of them, every time — even a UI that only changed one field. A field missing from a JS object doesn't show up as an obvious error client-side (`JSON.stringify` just quietly omits it); the failure appears one layer downstream, at the database bind step, which makes it easy to misdiagnose as a server bug rather than a missing argument.

---

## Passing a function by reference vs. calling it immediately

**Date:** 2026-07-23

### Problem
Two separate bugs, same root confusion:
1. `noteObj = { notes: note, handler: saveNote(id, newNote) }` — written during the Outlet-context refactor — threw `ReferenceError: id is not defined` on every render, and would have caused an infinite render loop even once that was fixed.
2. `<div onBlur={handleBlur}>` — the note card's blur handler — fired, but `title`/`content`/`starred` were always `undefined` inside `saveNote`.

### Root Cause
In case 1, `saveNote(id, newNote)` **calls** the function right then, during render, using variables (`id`, `newNote`) that didn't exist in that scope at all. Because it ran in the render body rather than in response to an event, and its body calls `setNote(...)`, it would have re-triggered a render, which would call it again, forever.

In case 2, `handleBlur` was handed to `onBlur` directly. React always calls an event handler prop with **its own** argument — the event object — not whatever arguments the function actually wants. `saveNote`'s signature is `(id, title, content, starred)`, so being invoked as `handleBlur(syntheticEvent)` silently supplied the event as `id` and left everything else `undefined`.

### Solution
- For the context object: pass `handler: saveNote` — the bare reference, no parentheses — so `NotesLayout`/`Note` can call it later with real arguments.
- For the blur handler: wrap it in an inline arrow function so the real arguments are supplied explicitly, discarding the event entirely: `onBlur={() => handleBlur(id, titleRef.current.value, contentRef.current.value, starred)}`.

### Lesson
A bare function name (`someFunction`) hands over a *reference* to be called later, by someone else, with arguments *they* choose to supply. Adding parentheses (`someFunction()`) calls it *immediately*, with whatever's in scope right now. When a framework (React events, Express routes) is the one doing the calling, and it would otherwise supply the "wrong" argument (an event, a request object) for what you actually need, wrap the reference in an inline arrow function so you control the arguments yourself, without losing the "call this later" behavior.

---

## Outlet context can only carry one value — every consumer must be updated in sync

**Date:** 2026-07-23

### Problem
`NotesLayout` crashed with `TypeError: notes.map is not a function` (twice, across two separate refactors) after `MainLayout` started passing a bundled object through `<Outlet context={...}/>` instead of a bare array.

### Root Cause
`<Outlet context={value}/>` accepts exactly one value. Once `notes` needed to travel alongside a function (`saveNote`) to support saving, the two had to be bundled into one object: `{ notes: note, handler: saveNote }`. But `NotesLayout` still read it with `const notes = useOutletContext()`, treating the *whole object* as if it were the array itself — so `notes.map(...)` was actually being called on `{ notes: [...], handler: fn }`, not on the array inside it.

A related mistake in the same area: `NotesLayout` briefly passed `handler={note.handler}` to each `<Note>` — but `handler` was a single value destructured from context at the top of the file, not a property that exists on each individual note object in the array.

### Solution
Updated `NotesLayout` to destructure both pieces out of the context object: `const { notes, handler } = useOutletContext()`, and passed the correctly-scoped `handler` (not `note.handler`) down to each `<Note>`.

### Lesson
Whenever the shape of a value flowing through Outlet context (or any prop) changes on the sending side, every place that reads it has to be updated at the same time — a partial update doesn't error at the point of the change, it silently breaks whatever tries to use the old shape, often several files away from where the actual change was made.

---

## `<input>` can't have children — it's a void element

**Date:** 2026-07-23

### Problem
Changing a note's title from `<span>{title}</span>` to `<input>{title}</input>` (to make it focusable/editable) crashed the render entirely.

### Root Cause
`<input>` is a void HTML element — self-closing by nature, with no concept of "content between the tags." React enforces this and throws: `input is a void element tag and must neither have children nor use dangerouslySetInnerHTML`. `<span>` allows children because it's a normal container element; `<input>` never does.

### Solution
Moved the text into a value-type prop instead of children: `<input defaultValue={title} />` (uncontrolled — sets the starting value once) rather than trying to nest `{title}` inside the tags.

### Lesson
Void elements (`input`, `img`, `br`, `hr`, etc.) never take children in JSX, regardless of what content model the element they're replacing had. Text/values for these elements always go through a prop (`value`, `defaultValue`, `src`, etc.), never as nested content.

---

## React hooks can only be called inside a component's function body

**Date:** 2026-07-23

### Problem
`MainLayout.jsx` threw `Invalid hook call. Hooks can only be called inside of the body of a function component` immediately on load.

### Root Cause
`useState` and a function that used its setter were written at module scope — above and outside the `MainLayout` function itself — rather than inside it:
```js
const [note, setNote] = useState([])   // outside MainLayout entirely

function MainLayout() { ... }
```
Hooks rely on React tracking which component is currently rendering, so state can be associated with that specific component instance. Module-level code runs once, at import time, with no component render in progress at all — there's nothing for React to attach the state to.

### Solution
Moved both the `useState` call and the function that used it inside the body of `MainLayout`, before its `return`.

### Lesson
Hooks are not just "functions that happen to manage state" — they depend on being invoked during an active component render. Anything using a hook (`useState`, `useEffect`, `useRef`, etc.) has to live inside a component function or a custom hook, never at the top level of a module.

---

## SQLite path resolves against `cwd`, not the file's location

**Date:** 2026-07-23

### Problem
After successfully creating a note through the API (`POST /notes` returned `201` with the created note), the note appeared to be "missing" — a SQLite GUI viewer opened on `notes.db` showed 0 rows, even though the server had reported success.

### Root Cause
`server/config/db.js` opened the database with a relative path:

```js
new Database('notes.db')
```

Relative paths in Node.js are resolved against `process.cwd()` — the directory the terminal was in when `node` was launched — not against the location of the file that contains the code. Since the server had been run from inside `server/` (`cd server && node server.js`), `'notes.db'` resolved to `server/notes.db`. But an earlier test run had been launched from the project root, creating a separate `notes.db` at the root instead.

This produced two independent SQLite database files:

```
./notes.db           (stale, created from an earlier run at the project root)
./server/notes.db    (the one actually being read/written by the current server process)
```

The GUI viewer was opened against the root-level file, which never received the new write — hence "0 rows," despite the insert having genuinely succeeded elsewhere.

### Solution
Two parts:

1. Deleted the stale root-level `notes.db` — confirmed safe first: 0 rows, already covered by `.gitignore`, never tracked in git.
2. Anchored the database path to the file's own location instead of the working directory, using `import.meta.dirname` (ESM's equivalent of the old CommonJS `__dirname`) combined with `path.join`:

   ```js
   import path from 'node:path'
   const db = new Database(path.join(import.meta.dirname, '..', 'notes.db'))
   ```

   This always resolves to `server/notes.db`, regardless of which directory `node` is launched from.

### Lesson
Any time a file path is passed as a bare relative string, it's implicitly depending on `process.cwd()` — a value that changes based on how the process was started, not where the code lives. For anything meant to be a stable, single file on disk (a database, a log file, an uploads folder), anchor the path to the source file's own location instead of trusting the current working directory.

# Learnings

Bugs and gotchas hit while building this project, and how they got solved. Newest entries at the top.

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

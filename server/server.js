import e from "express";
import cors from 'cors'
import 'dotenv/config'
import notesRouter from './routes/notes.js'

const PORT = process.env.PORT || 3000

const app = e()
app.use(cors())
app.use(e.json())

app.use('/notes', notesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
import {getAllNotes, getNoteById, createNote, updateNote, deleteNote} from '../controllers/notesController.js'
import e from 'express'

const router = e.Router();

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router
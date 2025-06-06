import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await db('notes')
      .select('*')
      .modify(builder => {
        // Filter by tags if provided
        if (req.query.tag) {
          builder.whereRaw(`json_extract(tags, '$') LIKE ?`, [`%${req.query.tag}%`]);
        }
        
        // Search in title or content
        if (req.query.search) {
          const searchTerm = `%${req.query.search}%`;
          builder.where(function() {
            this.where('title', 'like', searchTerm)
                .orWhere('content', 'like', searchTerm);
          });
        }
      })
      .orderBy('created_at', 'desc');
    
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get a specific note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await db('notes').where({ id: req.params.id }).first();
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    // Parse JSON fields if they're strings
    let noteData = { ...req.body };
    
    if (typeof noteData.tags === 'string') {
      try {
        noteData.tags = JSON.parse(noteData.tags);
      } catch (e) {
        noteData.tags = [];
      }
    }
    
    if (typeof noteData.relatedEntities === 'string') {
      try {
        noteData.relatedEntities = JSON.parse(noteData.relatedEntities);
      } catch (e) {
        noteData.relatedEntities = {};
      }
    }
    
    const [noteId] = await db('notes').insert(noteData);
    const newNote = await db('notes').where({ id: noteId }).first();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    // Parse JSON fields if they're strings
    let noteData = { ...req.body };
    
    if (typeof noteData.tags === 'string') {
      try {
        noteData.tags = JSON.parse(noteData.tags);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    if (typeof noteData.relatedEntities === 'string') {
      try {
        noteData.relatedEntities = JSON.parse(noteData.relatedEntities);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    await db('notes').where({ id: req.params.id }).update(noteData);
    const updatedNote = await db('notes').where({ id: req.params.id }).first();
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    await db('notes').where({ id: req.params.id }).del();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Get all tags used in notes
router.get('/tags/all', async (req, res) => {
  try {
    const notes = await db('notes').select('tags');
    
    // Extract all tags from all notes
    const allTags = new Set();
    notes.forEach(note => {
      if (note.tags) {
        const tags = typeof note.tags === 'string' ? JSON.parse(note.tags) : note.tags;
        if (Array.isArray(tags)) {
          tags.forEach(tag => allTags.add(tag));
        }
      }
    });
    
    res.json(Array.from(allTags));
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

export default router;


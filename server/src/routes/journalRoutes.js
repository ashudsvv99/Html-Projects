const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all journal entries
router.get('/', async (req, res) => {
  try {
    const entries = await db('journal_entries')
      .select('*')
      .orderBy('date', 'desc');
    
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Get a specific journal entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await db('journal_entries')
      .where({ id: req.params.id })
      .first();
    
    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
});

// Create a new journal entry
router.post('/', async (req, res) => {
  try {
    const [id] = await db('journal_entries').insert({
      date: req.body.date,
      morning_checklist: JSON.stringify(req.body.morningChecklist),
      daily_practices: JSON.stringify(req.body.dailyPractices),
      evening_checklist: JSON.stringify(req.body.eveningChecklist),
      mood: req.body.mood,
      energy: req.body.energy,
      notes: req.body.notes,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newEntry = await db('journal_entries').where({ id }).first();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Update a journal entry
router.put('/:id', async (req, res) => {
  try {
    const updated = await db('journal_entries')
      .where({ id: req.params.id })
      .update({
        date: req.body.date,
        morning_checklist: JSON.stringify(req.body.morningChecklist),
        daily_practices: JSON.stringify(req.body.dailyPractices),
        evening_checklist: JSON.stringify(req.body.eveningChecklist),
        mood: req.body.mood,
        energy: req.body.energy,
        notes: req.body.notes,
        updated_at: new Date()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    const updatedEntry = await db('journal_entries')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// Delete a journal entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('journal_entries')
      .where({ id: req.params.id })
      .del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

module.exports = router;

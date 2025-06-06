import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

// Get all journal entries
router.get('/', async (req, res) => {
  try {
    const entries = await db('journalEntries')
      .select('*')
      .modify(builder => {
        // Filter by date range if provided
        if (req.query.startDate) {
          builder.where('date', '>=', req.query.startDate);
        }
        if (req.query.endDate) {
          builder.where('date', '<=', req.query.endDate);
        }
        
        // Filter by mood rating if provided
        if (req.query.minMood) {
          builder.where('moodRating', '>=', req.query.minMood);
        }
        if (req.query.maxMood) {
          builder.where('moodRating', '<=', req.query.maxMood);
        }
      })
      .orderBy('date', 'desc');
    
    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Get a specific journal entry by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await db('journalEntries').where({ id: req.params.id }).first();
    
    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
});

// Get journal entry by date
router.get('/date/:date', async (req, res) => {
  try {
    const entry = await db('journalEntries').where({ date: req.params.date }).first();
    
    if (!entry) {
      return res.status(404).json({ error: 'No journal entry found for this date' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry by date:', error);
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
});

// Create a new journal entry
router.post('/', async (req, res) => {
  try {
    // Parse JSON fields if they're strings
    let entryData = { ...req.body };
    
    if (typeof entryData.morningChecklist === 'string') {
      try {
        entryData.morningChecklist = JSON.parse(entryData.morningChecklist);
      } catch (e) {
        entryData.morningChecklist = {};
      }
    }
    
    if (typeof entryData.dailyPractices === 'string') {
      try {
        entryData.dailyPractices = JSON.parse(entryData.dailyPractices);
      } catch (e) {
        entryData.dailyPractices = {};
      }
    }
    
    if (typeof entryData.eveningChecklist === 'string') {
      try {
        entryData.eveningChecklist = JSON.parse(entryData.eveningChecklist);
      } catch (e) {
        entryData.eveningChecklist = {};
      }
    }
    
    // Check if an entry already exists for this date
    const existingEntry = await db('journalEntries').where({ date: entryData.date }).first();
    
    if (existingEntry) {
      // Update existing entry
      await db('journalEntries').where({ id: existingEntry.id }).update(entryData);
      const updatedEntry = await db('journalEntries').where({ id: existingEntry.id }).first();
      return res.json(updatedEntry);
    }
    
    // Create new entry
    const [entryId] = await db('journalEntries').insert(entryData);
    const newEntry = await db('journalEntries').where({ id: entryId }).first();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Update a journal entry
router.put('/:id', async (req, res) => {
  try {
    // Parse JSON fields if they're strings
    let entryData = { ...req.body };
    
    if (typeof entryData.morningChecklist === 'string') {
      try {
        entryData.morningChecklist = JSON.parse(entryData.morningChecklist);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    if (typeof entryData.dailyPractices === 'string') {
      try {
        entryData.dailyPractices = JSON.parse(entryData.dailyPractices);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    if (typeof entryData.eveningChecklist === 'string') {
      try {
        entryData.eveningChecklist = JSON.parse(entryData.eveningChecklist);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    await db('journalEntries').where({ id: req.params.id }).update(entryData);
    const updatedEntry = await db('journalEntries').where({ id: req.params.id }).first();
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// Delete a journal entry
router.delete('/:id', async (req, res) => {
  try {
    await db('journalEntries').where({ id: req.params.id }).del();
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

// Get journal insights
router.get('/insights/weekly', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const entries = await db('journalEntries')
      .select('*')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'asc');
    
    // Calculate average mood
    const moodValues = entries
      .filter(entry => entry.moodRating !== null)
      .map(entry => entry.moodRating);
    
    const averageMood = moodValues.length > 0
      ? moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length
      : null;
    
    // Calculate completion rates for routines
    const routineCompletionRates = {
      morningRoutine: 0,
      dailyPractices: 0,
      eveningRoutine: 0
    };
    
    if (entries.length > 0) {
      let morningCount = 0;
      let dailyCount = 0;
      let eveningCount = 0;
      
      entries.forEach(entry => {
        // Check morning checklist completion
        if (entry.morningChecklist) {
          const checklist = typeof entry.morningChecklist === 'string'
            ? JSON.parse(entry.morningChecklist)
            : entry.morningChecklist;
            
          const totalItems = Object.keys(checklist).length;
          const completedItems = Object.values(checklist).filter(val => val === true).length;
          
          if (totalItems > 0) {
            morningCount += completedItems / totalItems;
          }
        }
        
        // Check daily practices completion
        if (entry.dailyPractices) {
          const practices = typeof entry.dailyPractices === 'string'
            ? JSON.parse(entry.dailyPractices)
            : entry.dailyPractices;
            
          const totalItems = Object.keys(practices).length;
          const completedItems = Object.values(practices).filter(val => val === true || (typeof val === 'number' && val > 0)).length;
          
          if (totalItems > 0) {
            dailyCount += completedItems / totalItems;
          }
        }
        
        // Check evening checklist completion
        if (entry.eveningChecklist) {
          const checklist = typeof entry.eveningChecklist === 'string'
            ? JSON.parse(entry.eveningChecklist)
            : entry.eveningChecklist;
            
          const totalItems = Object.keys(checklist).length;
          const completedItems = Object.values(checklist).filter(val => val === true).length;
          
          if (totalItems > 0) {
            eveningCount += completedItems / totalItems;
          }
        }
      });
      
      routineCompletionRates.morningRoutine = (morningCount / entries.length) * 100;
      routineCompletionRates.dailyPractices = (dailyCount / entries.length) * 100;
      routineCompletionRates.eveningRoutine = (eveningCount / entries.length) * 100;
    }
    
    // Calculate study hours
    let totalStudyHours = 0;
    entries.forEach(entry => {
      if (entry.dailyPractices) {
        const practices = typeof entry.dailyPractices === 'string'
          ? JSON.parse(entry.dailyPractices)
          : entry.dailyPractices;
          
        if (practices.studyMinutes) {
          totalStudyHours += practices.studyMinutes / 60;
        }
      }
    });
    
    const insights = {
      period: {
        startDate,
        endDate,
        totalDays: entries.length
      },
      averageMood,
      routineCompletionRates,
      totalStudyHours,
      entriesCount: entries.length
    };
    
    res.json(insights);
  } catch (error) {
    console.error('Error generating journal insights:', error);
    res.status(500).json({ error: 'Failed to generate journal insights' });
  }
});

export default router;


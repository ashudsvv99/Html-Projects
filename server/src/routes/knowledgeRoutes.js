const express = require('express');
const router = express.Router();
const db = require('../db');

// Concept Cards Routes
router.get('/concepts', async (req, res) => {
  try {
    const concepts = await db('concept_cards')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(concepts);
  } catch (error) {
    console.error('Error fetching concept cards:', error);
    res.status(500).json({ error: 'Failed to fetch concept cards' });
  }
});

router.get('/concepts/:id', async (req, res) => {
  try {
    const concept = await db('concept_cards')
      .where({ id: req.params.id })
      .first();
    
    if (!concept) {
      return res.status(404).json({ error: 'Concept card not found' });
    }
    
    res.json(concept);
  } catch (error) {
    console.error('Error fetching concept card:', error);
    res.status(500).json({ error: 'Failed to fetch concept card' });
  }
});

router.post('/concepts', async (req, res) => {
  try {
    const [id] = await db('concept_cards').insert({
      title: req.body.title,
      description: req.body.description,
      tags: JSON.stringify(req.body.tags || []),
      status: req.body.status,
      related_courses: JSON.stringify(req.body.relatedCourses || []),
      related_projects: JSON.stringify(req.body.relatedProjects || []),
      related_journals: JSON.stringify(req.body.relatedJournals || []),
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newConcept = await db('concept_cards').where({ id }).first();
    res.status(201).json(newConcept);
  } catch (error) {
    console.error('Error creating concept card:', error);
    res.status(500).json({ error: 'Failed to create concept card' });
  }
});

router.put('/concepts/:id', async (req, res) => {
  try {
    const updated = await db('concept_cards')
      .where({ id: req.params.id })
      .update({
        title: req.body.title,
        description: req.body.description,
        tags: JSON.stringify(req.body.tags || []),
        status: req.body.status,
        related_courses: JSON.stringify(req.body.relatedCourses || []),
        related_projects: JSON.stringify(req.body.relatedProjects || []),
        related_journals: JSON.stringify(req.body.relatedJournals || []),
        updated_at: new Date()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Concept card not found' });
    }
    
    const updatedConcept = await db('concept_cards')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedConcept);
  } catch (error) {
    console.error('Error updating concept card:', error);
    res.status(500).json({ error: 'Failed to update concept card' });
  }
});

router.delete('/concepts/:id', async (req, res) => {
  try {
    const deleted = await db('concept_cards')
      .where({ id: req.params.id })
      .del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Concept card not found' });
    }
    
    res.json({ message: 'Concept card deleted successfully' });
  } catch (error) {
    console.error('Error deleting concept card:', error);
    res.status(500).json({ error: 'Failed to delete concept card' });
  }
});

// Flashcard Decks Routes
router.get('/decks', async (req, res) => {
  try {
    const decks = await db('flashcard_decks')
      .select('*')
      .orderBy('created_at', 'desc');
    
    // Get card counts for each deck
    for (let deck of decks) {
      const cardsCount = await db('flashcards')
        .where({ deck_id: deck.id })
        .count('id as count')
        .first();
      
      const reviewedCount = await db('flashcards')
        .where({ deck_id: deck.id })
        .whereNotNull('last_reviewed')
        .count('id as count')
        .first();
      
      deck.cardsCount = cardsCount.count;
      deck.reviewedCount = reviewedCount.count;
    }
    
    res.json(decks);
  } catch (error) {
    console.error('Error fetching flashcard decks:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard decks' });
  }
});

router.post('/decks', async (req, res) => {
  try {
    const [id] = await db('flashcard_decks').insert({
      name: req.body.name,
      description: req.body.description,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newDeck = await db('flashcard_decks').where({ id }).first();
    res.status(201).json(newDeck);
  } catch (error) {
    console.error('Error creating flashcard deck:', error);
    res.status(500).json({ error: 'Failed to create flashcard deck' });
  }
});

router.put('/decks/:id', async (req, res) => {
  try {
    const updated = await db('flashcard_decks')
      .where({ id: req.params.id })
      .update({
        name: req.body.name,
        description: req.body.description,
        updated_at: new Date()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Flashcard deck not found' });
    }
    
    const updatedDeck = await db('flashcard_decks')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedDeck);
  } catch (error) {
    console.error('Error updating flashcard deck:', error);
    res.status(500).json({ error: 'Failed to update flashcard deck' });
  }
});

router.delete('/decks/:id', async (req, res) => {
  try {
    // First delete all flashcards in the deck
    await db('flashcards')
      .where({ deck_id: req.params.id })
      .del();
    
    // Then delete the deck
    const deleted = await db('flashcard_decks')
      .where({ id: req.params.id })
      .del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Flashcard deck not found' });
    }
    
    res.json({ message: 'Flashcard deck deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard deck:', error);
    res.status(500).json({ error: 'Failed to delete flashcard deck' });
  }
});

// Flashcards Routes
router.get('/decks/:deckId/cards', async (req, res) => {
  try {
    const flashcards = await db('flashcards')
      .where({ deck_id: req.params.deckId })
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

router.post('/flashcards', async (req, res) => {
  try {
    const [id] = await db('flashcards').insert({
      question: req.body.question,
      answer: req.body.answer,
      deck_id: req.body.deckId,
      difficulty: req.body.difficulty,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newFlashcard = await db('flashcards').where({ id }).first();
    res.status(201).json(newFlashcard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({ error: 'Failed to create flashcard' });
  }
});

router.put('/flashcards/:id', async (req, res) => {
  try {
    const updated = await db('flashcards')
      .where({ id: req.params.id })
      .update({
        question: req.body.question,
        answer: req.body.answer,
        deck_id: req.body.deckId,
        difficulty: req.body.difficulty,
        updated_at: new Date()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    
    const updatedFlashcard = await db('flashcards')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedFlashcard);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ error: 'Failed to update flashcard' });
  }
});

router.delete('/flashcards/:id', async (req, res) => {
  try {
    const deleted = await db('flashcards')
      .where({ id: req.params.id })
      .del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    
    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ error: 'Failed to delete flashcard' });
  }
});

router.post('/flashcards/:id/review', async (req, res) => {
  try {
    const now = new Date();
    
    // Calculate next review date based on difficulty
    let nextReview = new Date(now);
    switch (req.body.difficulty) {
      case 'Easy':
        nextReview.setDate(now.getDate() + 7); // Review in 7 days
        break;
      case 'Medium':
        nextReview.setDate(now.getDate() + 3); // Review in 3 days
        break;
      case 'Hard':
        nextReview.setDate(now.getDate() + 1); // Review in 1 day
        break;
      default:
        nextReview.setDate(now.getDate() + 3); // Default to 3 days
    }
    
    const updated = await db('flashcards')
      .where({ id: req.params.id })
      .update({
        last_reviewed: now,
        next_review: nextReview,
        difficulty: req.body.difficulty,
        updated_at: now
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    
    const updatedFlashcard = await db('flashcards')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedFlashcard);
  } catch (error) {
    console.error('Error updating flashcard review:', error);
    res.status(500).json({ error: 'Failed to update flashcard review' });
  }
});

// Ideas Routes
router.get('/ideas', async (req, res) => {
  try {
    const ideas = await db('ideas')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

router.post('/ideas', async (req, res) => {
  try {
    const [id] = await db('ideas').insert({
      content: req.body.content,
      category: req.body.category,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newIdea = await db('ideas').where({ id }).first();
    res.status(201).json(newIdea);
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

router.put('/ideas/:id', async (req, res) => {
  try {
    const updated = await db('ideas')
      .where({ id: req.params.id })
      .update({
        content: req.body.content,
        category: req.body.category,
        updated_at: new Date()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const updatedIdea = await db('ideas')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedIdea);
  } catch (error) {
    console.error('Error updating idea:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
});

router.delete('/ideas/:id', async (req, res) => {
  try {
    const deleted = await db('ideas')
      .where({ id: req.params.id })
      .del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Error deleting idea:', error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
});

module.exports = router;

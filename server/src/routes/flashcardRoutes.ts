import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

// Get all flashcard decks
router.get('/decks', async (req, res) => {
  try {
    const decks = await db('flashcardDecks').select('*');
    
    // For each deck, get the count of cards and mastery percentage
    const decksWithStats = await Promise.all(decks.map(async (deck) => {
      const totalCards = await db('flashcards')
        .where({ deckId: deck.id })
        .count('* as count')
        .first();
      
      const masteredCards = await db('flashcards')
        .where({ deckId: deck.id, reviewStatus: 'Mastered' })
        .count('* as count')
        .first();
      
      const totalCount = totalCards ? totalCards.count : 0;
      const masteredCount = masteredCards ? masteredCards.count : 0;
      const masteryPercentage = totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;
      
      return {
        ...deck,
        cardCount: totalCount,
        masteryPercentage
      };
    }));
    
    res.json(decksWithStats);
  } catch (error) {
    console.error('Error fetching flashcard decks:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard decks' });
  }
});

// Get a specific flashcard deck by ID
router.get('/decks/:id', async (req, res) => {
  try {
    const deck = await db('flashcardDecks').where({ id: req.params.id }).first();
    
    if (!deck) {
      return res.status(404).json({ error: 'Flashcard deck not found' });
    }
    
    // Get cards for this deck
    const cards = await db('flashcards')
      .where({ deckId: req.params.id })
      .orderBy('created_at', 'asc');
    
    // Get stats for this deck
    const totalCards = cards.length;
    const masteredCards = cards.filter(card => card.reviewStatus === 'Mastered').length;
    const masteryPercentage = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;
    
    const deckWithCards = {
      ...deck,
      cards,
      stats: {
        totalCards,
        masteredCards,
        masteryPercentage,
        statusCounts: {
          new: cards.filter(card => card.reviewStatus === 'New').length,
          learning: cards.filter(card => card.reviewStatus === 'Learning').length,
          review: cards.filter(card => card.reviewStatus === 'Review').length,
          mastered: masteredCards
        }
      }
    };
    
    res.json(deckWithCards);
  } catch (error) {
    console.error('Error fetching flashcard deck:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard deck' });
  }
});

// Create a new flashcard deck
router.post('/decks', async (req, res) => {
  try {
    const [deckId] = await db('flashcardDecks').insert(req.body);
    const newDeck = await db('flashcardDecks').where({ id: deckId }).first();
    res.status(201).json(newDeck);
  } catch (error) {
    console.error('Error creating flashcard deck:', error);
    res.status(500).json({ error: 'Failed to create flashcard deck' });
  }
});

// Update a flashcard deck
router.put('/decks/:id', async (req, res) => {
  try {
    await db('flashcardDecks').where({ id: req.params.id }).update(req.body);
    const updatedDeck = await db('flashcardDecks').where({ id: req.params.id }).first();
    res.json(updatedDeck);
  } catch (error) {
    console.error('Error updating flashcard deck:', error);
    res.status(500).json({ error: 'Failed to update flashcard deck' });
  }
});

// Delete a flashcard deck
router.delete('/decks/:id', async (req, res) => {
  try {
    // First delete all cards in this deck
    await db('flashcards').where({ deckId: req.params.id }).del();
    
    // Then delete the deck itself
    await db('flashcardDecks').where({ id: req.params.id }).del();
    
    res.json({ message: 'Flashcard deck and all cards deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard deck:', error);
    res.status(500).json({ error: 'Failed to delete flashcard deck' });
  }
});

// Get all flashcards for a deck
router.get('/decks/:deckId/cards', async (req, res) => {
  try {
    const cards = await db('flashcards')
      .where({ deckId: req.params.deckId })
      .modify(builder => {
        // Filter by review status if provided
        if (req.query.status) {
          builder.where('reviewStatus', req.query.status);
        }
      })
      .orderBy('created_at', 'asc');
    
    res.json(cards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

// Get a specific flashcard by ID
router.get('/cards/:id', async (req, res) => {
  try {
    const card = await db('flashcards').where({ id: req.params.id }).first();
    
    if (!card) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    
    res.json(card);
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard' });
  }
});

// Create a new flashcard
router.post('/decks/:deckId/cards', async (req, res) => {
  try {
    const deckId = req.params.deckId;
    
    // Check if deck exists
    const deck = await db('flashcardDecks').where({ id: deckId }).first();
    
    if (!deck) {
      return res.status(404).json({ error: 'Flashcard deck not found' });
    }
    
    const cardData = {
      ...req.body,
      deckId,
      reviewStatus: 'New'
    };
    
    const [cardId] = await db('flashcards').insert(cardData);
    const newCard = await db('flashcards').where({ id: cardId }).first();
    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({ error: 'Failed to create flashcard' });
  }
});

// Update a flashcard
router.put('/cards/:id', async (req, res) => {
  try {
    await db('flashcards').where({ id: req.params.id }).update(req.body);
    const updatedCard = await db('flashcards').where({ id: req.params.id }).first();
    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ error: 'Failed to update flashcard' });
  }
});

// Delete a flashcard
router.delete('/cards/:id', async (req, res) => {
  try {
    await db('flashcards').where({ id: req.params.id }).del();
    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ error: 'Failed to delete flashcard' });
  }
});

// Update flashcard review status
router.put('/cards/:id/review', async (req, res) => {
  try {
    const { reviewStatus } = req.body;
    
    if (!reviewStatus || !['New', 'Learning', 'Review', 'Mastered'].includes(reviewStatus)) {
      return res.status(400).json({ error: 'Invalid review status. Must be New, Learning, Review, or Mastered' });
    }
    
    await db('flashcards').where({ id: req.params.id }).update({ 
      reviewStatus,
      lastReviewed: new Date().toISOString().split('T')[0]
    });
    
    const updatedCard = await db('flashcards').where({ id: req.params.id }).first();
    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating flashcard review status:', error);
    res.status(500).json({ error: 'Failed to update flashcard review status' });
  }
});

// Get cards for review
router.get('/review', async (req, res) => {
  try {
    const { deckId, limit = 10 } = req.query;
    
    const query = db('flashcards')
      .modify(builder => {
        if (deckId) {
          builder.where({ deckId });
        }
        
        // Prioritize cards based on review status
        builder.orderByRaw(`
          CASE 
            WHEN reviewStatus = 'New' THEN 1
            WHEN reviewStatus = 'Learning' THEN 2
            WHEN reviewStatus = 'Review' THEN 3
            WHEN reviewStatus = 'Mastered' THEN 4
          END
        `);
        
        // Then by last reviewed date (oldest first)
        builder.orderBy('lastReviewed', 'asc');
      })
      .limit(limit);
    
    const cards = await query;
    
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards for review:', error);
    res.status(500).json({ error: 'Failed to fetch cards for review' });
  }
});

export default router;


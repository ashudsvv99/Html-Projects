import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

// Get all knowledge items
router.get('/', async (req, res) => {
  try {
    const items = await db('knowledgeItems')
      .select('*')
      .modify(builder => {
        // Filter by status if provided
        if (req.query.status) {
          builder.where('status', req.query.status);
        }
        
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
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching knowledge items:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge items' });
  }
});

// Get a specific knowledge item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await db('knowledgeItems').where({ id: req.params.id }).first();
    
    if (!item) {
      return res.status(404).json({ error: 'Knowledge item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching knowledge item:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge item' });
  }
});

// Create a new knowledge item
router.post('/', async (req, res) => {
  try {
    // Parse JSON fields if they're strings
    let itemData = { ...req.body };
    
    if (typeof itemData.tags === 'string') {
      try {
        itemData.tags = JSON.parse(itemData.tags);
      } catch (e) {
        itemData.tags = [];
      }
    }
    
    if (typeof itemData.relatedEntities === 'string') {
      try {
        itemData.relatedEntities = JSON.parse(itemData.relatedEntities);
      } catch (e) {
        itemData.relatedEntities = {};
      }
    }
    
    const [itemId] = await db('knowledgeItems').insert(itemData);
    const newItem = await db('knowledgeItems').where({ id: itemId }).first();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating knowledge item:', error);
    res.status(500).json({ error: 'Failed to create knowledge item' });
  }
});

// Update a knowledge item
router.put('/:id', async (req, res) => {
  try {
    // Parse JSON fields if they're strings
    let itemData = { ...req.body };
    
    if (typeof itemData.tags === 'string') {
      try {
        itemData.tags = JSON.parse(itemData.tags);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    if (typeof itemData.relatedEntities === 'string') {
      try {
        itemData.relatedEntities = JSON.parse(itemData.relatedEntities);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    await db('knowledgeItems').where({ id: req.params.id }).update(itemData);
    const updatedItem = await db('knowledgeItems').where({ id: req.params.id }).first();
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating knowledge item:', error);
    res.status(500).json({ error: 'Failed to update knowledge item' });
  }
});

// Delete a knowledge item
router.delete('/:id', async (req, res) => {
  try {
    await db('knowledgeItems').where({ id: req.params.id }).del();
    res.json({ message: 'Knowledge item deleted successfully' });
  } catch (error) {
    console.error('Error deleting knowledge item:', error);
    res.status(500).json({ error: 'Failed to delete knowledge item' });
  }
});

// Update knowledge item status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Draft', 'Reviewed', 'Riveted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Draft, Reviewed, or Riveted' });
    }
    
    await db('knowledgeItems').where({ id: req.params.id }).update({ status });
    const updatedItem = await db('knowledgeItems').where({ id: req.params.id }).first();
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating knowledge item status:', error);
    res.status(500).json({ error: 'Failed to update knowledge item status' });
  }
});

// Get all tags used in knowledge items
router.get('/tags/all', async (req, res) => {
  try {
    const items = await db('knowledgeItems').select('tags');
    
    // Extract all tags from all items
    const allTags = new Set();
    items.forEach(item => {
      if (item.tags) {
        const tags = typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags;
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


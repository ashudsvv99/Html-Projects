import express, { Request, Response } from 'express';
import db from '../db';

const router = express.Router();

// Questions Routes
router.get('/', async (req: Request, res: Response) => {
  try {
    const questions = await db('interview_questions')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching interview questions:', error);
    res.status(500).json({ error: 'Failed to fetch interview questions' });
  }
});

router.get('/questions/:id', async (req: Request, res: Response) => {
  try {
    const question = await db('interview_questions')
      .where({ id: req.params.id })
      .first();
    
    if (!question) {
      return res.status(404).json({ error: 'Interview question not found' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Error fetching interview question:', error);
    res.status(500).json({ error: 'Failed to fetch interview question' });
  }
});

router.post('/questions', async (req: Request, res: Response) => {
  try {
    const [id] = await db('interview_questions').insert({
      category: req.body.category,
      difficulty: req.body.difficulty,
      question: req.body.question,
      answer: req.body.answer,
      notes: req.body.notes,
      is_reviewed: req.body.isReviewed || false,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newQuestion = await db('interview_questions').where({ id }).first();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating interview question:', error);
    res.status(500).json({ error: 'Failed to create interview question' });
  }
});

router.put('/questions/:id', async (req: Request, res: Response) => {
  try {
    const updated = await db('interview_questions')
      .where({ id: req.params.id })
      .update({
        category: req.body.category,
        difficulty: req.body.difficulty,
        question: req.body.question,
        answer: req.body.answer,
        notes: req.body.notes,
        is_reviewed: req.body.isReviewed,
        updated_at: new Date()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Interview question not found' });
    }
    
    const updatedQuestion = await db('interview_questions')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating interview question:', error);
    res.status(500).json({ error: 'Failed to update interview question' });
  }
});

router.patch('/questions/:id', async (req: Request, res: Response) => {
  try {
    const updateData: any = {};
    
    if (req.body.isReviewed !== undefined) {
      updateData.is_reviewed = req.body.isReviewed;
      
      if (req.body.isReviewed) {
        updateData.last_reviewed = new Date();
      }
    }
    
    updateData.updated_at = new Date();
    
    const updated = await db('interview_questions')
      .where({ id: req.params.id })
      .update(updateData);
    
    if (!updated) {
      return res.status(404).json({ error: 'Interview question not found' });
    }
    
    const updatedQuestion = await db('interview_questions')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating interview question:', error);
    res.status(500).json({ error: 'Failed to update interview question' });
  }
});

router.delete('/questions/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await db('interview_questions')
      .where({ id: req.params.id })
      .del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Interview question not found' });
    }
    
    res.json({ message: 'Interview question deleted successfully' });
  } catch (error) {
    console.error('Error deleting interview question:', error);
    res.status(500).json({ error: 'Failed to delete interview question' });
  }
});

// Mock Interviews Routes
router.get('/mock-interviews', async (req: Request, res: Response) => {
  try {
    const interviews = await db('mock_interviews')
      .select('*')
      .orderBy('scheduled_for', 'asc');
    
    res.json(interviews);
  } catch (error) {
    console.error('Error fetching mock interviews:', error);
    res.status(500).json({ error: 'Failed to fetch mock interviews' });
  }
});

router.get('/mock-interviews/:id', async (req: Request, res: Response) => {
  try {
    const interview = await db('mock_interviews')
      .where({ id: req.params.id })
      .first();
    
    if (!interview) {
      return res.status(404).json({ error: 'Mock interview not found' });
    }
    
    res.json(interview);
  } catch (error) {
    console.error('Error fetching mock interview:', error);
    res.status(500).json({ error: 'Failed to fetch mock interview' });
  }
});

router.post('/mock-interviews', async (req: Request, res: Response) => {
  try {
    const [id] = await db('mock_interviews').insert({
      title: req.body.title,
      scheduled_for: req.body.scheduledFor,
      duration: req.body.duration,
      topics: JSON.stringify(req.body.topics || []),
      notes: req.body.notes,
      is_completed: req.body.isCompleted || false,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newInterview = await db('mock_interviews').where({ id }).first();
    res.status(201).json(newInterview);
  } catch (error) {
    console.error('Error creating mock interview:', error);
    res.status(500).json({ error: 'Failed to create mock interview' });
  }
});

router.put('/mock-interviews/:id', async (req: Request, res: Response) => {
  try {
    const updated = await db('mock_interviews')
      .where({ id: req.params.id })
      .update({
        title: req.body.title,
        scheduled_for: req.body.scheduledFor,
        duration: req.body.duration,
        topics: JSON.stringify(req.body.topics || []),
        notes: req.body.notes,
        is_completed: req.body.isCompleted,
        updated_at: new Date()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Mock interview not found' });
    }
    
    const updatedInterview = await db('mock_interviews')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedInterview);
  } catch (error) {
    console.error('Error updating mock interview:', error);
    res.status(500).json({ error: 'Failed to update mock interview' });
  }
});

router.patch('/mock-interviews/:id', async (req: Request, res: Response) => {
  try {
    const updateData: any = {};
    
    if (req.body.isCompleted !== undefined) {
      updateData.is_completed = req.body.isCompleted;
    }
    
    updateData.updated_at = new Date();
    
    const updated = await db('mock_interviews')
      .where({ id: req.params.id })
      .update(updateData);
    
    if (!updated) {
      return res.status(404).json({ error: 'Mock interview not found' });
    }
    
    const updatedInterview = await db('mock_interviews')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedInterview);
  } catch (error) {
    console.error('Error updating mock interview:', error);
    res.status(500).json({ error: 'Failed to update mock interview' });
  }
});

router.delete('/mock-interviews/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await db('mock_interviews')
      .where({ id: req.params.id })
      .del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Mock interview not found' });
    }
    
    res.json({ message: 'Mock interview deleted successfully' });
  } catch (error) {
    console.error('Error deleting mock interview:', error);
    res.status(500).json({ error: 'Failed to delete mock interview' });
  }
});

// Resources Routes
router.get('/resources', async (req: Request, res: Response) => {
  try {
    const resources = await db('interview_resources')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(resources);
  } catch (error) {
    console.error('Error fetching interview resources:', error);
    res.status(500).json({ error: 'Failed to fetch interview resources' });
  }
});

router.get('/resources/:id', async (req: Request, res: Response) => {
  try {
    const resource = await db('interview_resources')
      .where({ id: req.params.id })
      .first();
    
    if (!resource) {
      return res.status(404).json({ error: 'Interview resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Error fetching interview resource:', error);
    res.status(500).json({ error: 'Failed to fetch interview resource' });
  }
});

router.post('/resources', async (req: Request, res: Response) => {
  try {
    const [id] = await db('interview_resources').insert({
      title: req.body.title,
      type: req.body.type,
      content: req.body.content,
      category: req.body.category,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newResource = await db('interview_resources').where({ id }).first();
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating interview resource:', error);
    res.status(500).json({ error: 'Failed to create interview resource' });
  }
});

router.put('/resources/:id', async (req: Request, res: Response) => {
  try {
    const updated = await db('interview_resources')
      .where({ id: req.params.id })
      .update({
        title: req.body.title,
        type: req.body.type,
        content: req.body.content,
        category: req.body.category,
        updated_at: new Date()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Interview resource not found' });
    }
    
    const updatedResource = await db('interview_resources')
      .where({ id: req.params.id })
      .first();
    
    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating interview resource:', error);
    res.status(500).json({ error: 'Failed to update interview resource' });
  }
});

router.delete('/resources/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await db('interview_resources')
      .where({ id: req.params.id })
      .del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Interview resource not found' });
    }
    
    res.json({ message: 'Interview resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting interview resource:', error);
    res.status(500).json({ error: 'Failed to delete interview resource' });
  }
});

export default router;


import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await db('courses').select('*');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get a specific course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await db('courses').where({ id: req.params.id }).first();
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Get lessons for this course
    const lessons = await db('lessons')
      .where({ courseId: req.params.id })
      .orderBy('order', 'asc');
    
    res.json({ ...course, lessons });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create a new course
router.post('/', async (req, res) => {
  try {
    const [courseId] = await db('courses').insert(req.body);
    const newCourse = await db('courses').where({ id: courseId }).first();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course
router.put('/:id', async (req, res) => {
  try {
    await db('courses').where({ id: req.params.id }).update(req.body);
    const updatedCourse = await db('courses').where({ id: req.params.id }).first();
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    await db('courses').where({ id: req.params.id }).del();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Add a lesson to a course
router.post('/:id/lessons', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await db('courses').where({ id: courseId }).first();
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Get the highest order value to place the new lesson at the end
    const maxOrderResult = await db('lessons')
      .where({ courseId })
      .max('order as maxOrder')
      .first();
    
    const order = maxOrderResult.maxOrder ? maxOrderResult.maxOrder + 1 : 1;
    
    const [lessonId] = await db('lessons').insert({
      ...req.body,
      courseId,
      order
    });
    
    // Update course totalLessons count
    await db('courses')
      .where({ id: courseId })
      .update({ 
        totalLessons: db.raw('totalLessons + 1')
      });
    
    const newLesson = await db('lessons').where({ id: lessonId }).first();
    res.status(201).json(newLesson);
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({ error: 'Failed to add lesson' });
  }
});

// Mark a lesson as completed
router.put('/:courseId/lessons/:lessonId/complete', async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { completed } = req.body;
    
    // Update the lesson completion status
    await db('lessons')
      .where({ id: lessonId, courseId })
      .update({ completed });
    
    // Count completed lessons for this course
    const completedCount = await db('lessons')
      .where({ courseId, completed: true })
      .count('* as count')
      .first();
    
    // Get total lessons for this course
    const totalCount = await db('lessons')
      .where({ courseId })
      .count('* as count')
      .first();
    
    const completedLessons = completedCount.count;
    const totalLessons = totalCount.count;
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    
    // Update course progress
    await db('courses')
      .where({ id: courseId })
      .update({ 
        completedLessons,
        progress
      });
    
    const updatedLesson = await db('lessons')
      .where({ id: lessonId })
      .first();
    
    res.json(updatedLesson);
  } catch (error) {
    console.error('Error updating lesson completion:', error);
    res.status(500).json({ error: 'Failed to update lesson completion' });
  }
});

export default router;


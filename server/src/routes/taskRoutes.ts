import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await db('tasks')
      .select('*')
      .where((builder) => {
        // Filter by completion status if provided
        if (req.query.completed !== undefined) {
          builder.where('completed', req.query.completed === 'true');
        }
        
        // Filter by due date range if provided
        if (req.query.startDate) {
          builder.where('dueDate', '>=', req.query.startDate);
        }
        if (req.query.endDate) {
          builder.where('dueDate', '<=', req.query.endDate);
        }
        
        // Filter by priority if provided
        if (req.query.priority) {
          builder.where('priority', req.query.priority);
        }
        
        // Only get top-level tasks (no parent)
        if (req.query.topLevelOnly === 'true') {
          builder.whereNull('parentTaskId');
        }
      })
      .orderBy('dueDate', 'asc');
    
    // If we want to include subtasks
    if (req.query.includeSubtasks === 'true') {
      // Get all tasks including subtasks
      const allTasks = await db('tasks').select('*');
      
      // Create a map of parent tasks to their subtasks
      const taskMap = allTasks.reduce((map, task) => {
        if (!map[task.id]) {
          map[task.id] = { ...task, subtasks: [] };
        }
        
        if (task.parentTaskId) {
          if (!map[task.parentTaskId]) {
            map[task.parentTaskId] = { subtasks: [] };
          }
          map[task.parentTaskId].subtasks.push(task);
        }
        
        return map;
      }, {});
      
      // Filter to only return top-level tasks with their subtasks
      const tasksWithSubtasks = allTasks
        .filter(task => !task.parentTaskId)
        .map(task => taskMap[task.id]);
      
      return res.json(tasksWithSubtasks);
    }
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await db('tasks').where({ id: req.params.id }).first();
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Get subtasks if requested
    if (req.query.includeSubtasks === 'true') {
      const subtasks = await db('tasks').where({ parentTaskId: req.params.id });
      task.subtasks = subtasks;
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    // Parse tags if it's a string
    let taskData = { ...req.body };
    if (typeof taskData.tags === 'string') {
      try {
        taskData.tags = JSON.parse(taskData.tags);
      } catch (e) {
        taskData.tags = [];
      }
    }
    
    const [taskId] = await db('tasks').insert(taskData);
    const newTask = await db('tasks').where({ id: taskId }).first();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    // Parse tags if it's a string
    let taskData = { ...req.body };
    if (typeof taskData.tags === 'string') {
      try {
        taskData.tags = JSON.parse(taskData.tags);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    await db('tasks').where({ id: req.params.id }).update(taskData);
    const updatedTask = await db('tasks').where({ id: req.params.id }).first();
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    // First delete all subtasks
    await db('tasks').where({ parentTaskId: req.params.id }).del();
    
    // Then delete the task itself
    await db('tasks').where({ id: req.params.id }).del();
    
    res.json({ message: 'Task and all subtasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Toggle task completion
router.put('/:id/toggle', async (req, res) => {
  try {
    // Get current task
    const task = await db('tasks').where({ id: req.params.id }).first();
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Toggle completion status
    const completed = !task.completed;
    
    await db('tasks').where({ id: req.params.id }).update({ completed });
    
    // If completing a task, also mark all subtasks as completed
    if (completed) {
      await db('tasks').where({ parentTaskId: req.params.id }).update({ completed: true });
    }
    
    const updatedTask = await db('tasks').where({ id: req.params.id }).first();
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
});

// Add a subtask
router.post('/:id/subtasks', async (req, res) => {
  try {
    const parentId = req.params.id;
    
    // Check if parent task exists
    const parentTask = await db('tasks').where({ id: parentId }).first();
    
    if (!parentTask) {
      return res.status(404).json({ error: 'Parent task not found' });
    }
    
    // Create subtask
    const subtaskData = {
      ...req.body,
      parentTaskId: parentId
    };
    
    const [subtaskId] = await db('tasks').insert(subtaskData);
    const newSubtask = await db('tasks').where({ id: subtaskId }).first();
    
    res.status(201).json(newSubtask);
  } catch (error) {
    console.error('Error creating subtask:', error);
    res.status(500).json({ error: 'Failed to create subtask' });
  }
});

export default router;


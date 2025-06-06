import express from 'express';
import { db } from '../db/setup';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await db('projects').select('*');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get a specific project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await db('projects').where({ id: req.params.id }).first();
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    // Parse techStack if it's a string
    let projectData = { ...req.body };
    if (typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch (e) {
        projectData.techStack = [];
      }
    }
    
    const [projectId] = await db('projects').insert(projectData);
    const newProject = await db('projects').where({ id: projectId }).first();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    // Parse techStack if it's a string
    let projectData = { ...req.body };
    if (typeof projectData.techStack === 'string') {
      try {
        projectData.techStack = JSON.parse(projectData.techStack);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    
    await db('projects').where({ id: req.params.id }).update(projectData);
    const updatedProject = await db('projects').where({ id: req.params.id }).first();
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    await db('projects').where({ id: req.params.id }).del();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Update project progress
router.put('/:id/progress', async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ error: 'Progress must be a number between 0 and 100' });
    }
    
    await db('projects')
      .where({ id: req.params.id })
      .update({ progress });
    
    // If progress is 100%, update status to Completed
    if (progress === 100) {
      await db('projects')
        .where({ id: req.params.id })
        .update({ status: 'Completed' });
    } 
    // If progress is > 0 but < 100, ensure status is In Progress
    else if (progress > 0) {
      const project = await db('projects').where({ id: req.params.id }).first();
      if (project && project.status === 'Not Started') {
        await db('projects')
          .where({ id: req.params.id })
          .update({ status: 'In Progress' });
      }
    }
    
    const updatedProject = await db('projects').where({ id: req.params.id }).first();
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project progress:', error);
    res.status(500).json({ error: 'Failed to update project progress' });
  }
});

export default router;


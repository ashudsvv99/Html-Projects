import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  PlayArrow as StartIcon
} from '@mui/icons-material';
import axios from 'axios';

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  progress: number;
  startDate: string;
  category: string;
  techStack: string[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    progress: 0,
    startDate: new Date().toISOString().split('T')[0],
    category: '',
    techStack: []
  });
  const [isNewProject, setIsNewProject] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [techInput, setTechInput] = useState('');
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // In a real app, this would be an actual API call
        // For now, we'll simulate with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockProjects: Project[] = [
          {
            id: 1,
            title: 'Build a Sentiment Analysis Web App',
            description: 'Create a web application that analyzes sentiment in social media posts using NLP techniques.',
            status: 'In Progress',
            priority: 'High',
            progress: 65,
            startDate: '2024-01-15',
            category: 'Natural Language Processing',
            techStack: ['Python', 'Flask', 'NLTK', 'React', 'GitHub']
          },
          {
            id: 2,
            title: 'Personal Finance Dashboard',
            description: 'Develop a dashboard to track personal finances, expenses, and investments.',
            status: 'Completed',
            priority: 'Medium',
            progress: 100,
            startDate: '2023-11-20',
            category: 'Web Development',
            techStack: ['JavaScript', 'React', 'Chart.js', 'Firebase']
          },
          {
            id: 3,
            title: 'Image Recognition Mobile App',
            description: 'Build a mobile app that can identify objects in photos using machine learning.',
            status: 'Not Started',
            priority: 'Medium',
            progress: 0,
            startDate: '2024-03-01',
            category: 'Computer Vision',
            techStack: ['Python', 'TensorFlow', 'React Native', 'Firebase']
          },
          {
            id: 4,
            title: 'E-commerce Platform',
            description: 'Create a full-featured e-commerce platform with product listings, cart, and checkout.',
            status: 'In Progress',
            priority: 'High',
            progress: 40,
            startDate: '2024-02-10',
            category: 'Web Development',
            techStack: ['TypeScript', 'Next.js', 'MongoDB', 'Stripe', 'AWS']
          },
          {
            id: 5,
            title: 'Algorithmic Trading Bot',
            description: 'Develop a bot that can analyze market data and execute trades based on predefined strategies.',
            status: 'Not Started',
            priority: 'Low',
            progress: 0,
            startDate: '2024-04-15',
            category: 'Finance',
            techStack: ['Python', 'Pandas', 'NumPy', 'API Integration']
          }
        ];
        
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.status === statusFilter));
    }
  }, [statusFilter, projects]);
  
  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setCurrentProject({...project});
      setIsNewProject(false);
    } else {
      setCurrentProject({
        title: '',
        description: '',
        status: 'Not Started',
        priority: 'Medium',
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        category: '',
        techStack: []
      });
      setIsNewProject(true);
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentProject(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleAddTech = () => {
    if (techInput.trim() && !currentProject.techStack?.includes(techInput.trim())) {
      setCurrentProject(prev => ({
        ...prev,
        techStack: [...(prev.techStack || []), techInput.trim()]
      }));
      setTechInput('');
    }
  };
  
  const handleDeleteTech = (techToDelete: string) => {
    setCurrentProject(prev => ({
      ...prev,
      techStack: prev.techStack?.filter(tech => tech !== techToDelete)
    }));
  };
  
  const handleSaveProject = async () => {
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate saving
      
      if (isNewProject) {
        // Simulate adding a new project
        const newProject: Project = {
          ...currentProject as Project,
          id: Math.max(...projects.map(p => p.id), 0) + 1
        };
        setProjects([...projects, newProject]);
      } else {
        // Simulate updating an existing project
        setProjects(projects.map(project => 
          project.id === currentProject.id ? {...project, ...currentProject} : project
        ));
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };
  
  const handleDeleteProject = async (id: number) => {
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate deletion
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleViewModeChange = (event: React.SyntheticEvent, newValue: number) => {
    setViewMode(newValue === 0 ? 'card' : 'table');
  };
  
  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return 'default';
      case 'In Progress': return 'primary';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Projects</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Project
        </Button>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={viewMode === 'card' ? 0 : 1} onChange={handleViewModeChange}>
          <Tab label="Card View" />
          <Tab label="Table View" />
        </Tabs>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {viewMode === 'card' ? (
            <Grid container spacing={3}>
              {filteredProjects.map(project => (
                <Grid item xs={12} md={6} lg={4} key={project.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {project.title}
                        </Typography>
                        <Chip 
                          label={project.status} 
                          color={getStatusColor(project.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {project.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          Category: {project.category}
                        </Typography>
                        <Chip 
                          label={project.priority} 
                          color={getPriorityColor(project.priority)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Started: {new Date(project.startDate).toLocaleDateString()}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Progress</Typography>
                          <Typography variant="body2">{project.progress}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={project.progress} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {project.techStack.map(tech => (
                          <Chip key={tech} label={tech} size="small" />
                        ))}
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      {project.status !== 'Completed' && (
                        <Button 
                          size="small" 
                          startIcon={project.status === 'Not Started' ? <StartIcon /> : <CodeIcon />}
                        >
                          {project.status === 'Not Started' ? 'Start' : 'Work on Project'}
                        </Button>
                      )}
                      <Box sx={{ flexGrow: 1 }} />
                      <IconButton size="small" onClick={() => handleOpenDialog(project)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteProject(project.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProjects
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(project => (
                        <TableRow key={project.id}>
                          <TableCell>{project.title}</TableCell>
                          <TableCell>
                            <Chip 
                              label={project.status} 
                              color={getStatusColor(project.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={project.priority} 
                              color={getPriorityColor(project.priority)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 150 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={project.progress} 
                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="body2">{project.progress}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleOpenDialog(project)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteProject(project.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProjects.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </>
      )}
      
      {/* Project Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isNewProject ? 'Add New Project' : 'Edit Project'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={currentProject.title}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={currentProject.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentProject.status}
                  label="Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={currentProject.priority}
                  label="Priority"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                value={currentProject.category}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={currentProject.startDate}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {!isNewProject && (
              <Grid item xs={12}>
                <TextField
                  label="Progress (%)"
                  name="progress"
                  type="number"
                  value={currentProject.progress}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={8}>
              <TextField
                label="Add Technology"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                fullWidth
                margin="normal"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTech();
                    e.preventDefault();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                variant="outlined" 
                onClick={handleAddTech}
                sx={{ mt: 3 }}
                fullWidth
              >
                Add Tech
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {currentProject.techStack?.map(tech => (
                  <Chip 
                    key={tech} 
                    label={tech} 
                    onDelete={() => handleDeleteTech(tech)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProject} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;


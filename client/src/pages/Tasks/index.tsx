import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  subtasks?: {
    id: number;
    title: string;
    completed: boolean;
  }[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    completed: false,
    priority: 'Medium',
    tags: [],
    subtasks: []
  });
  const [isNewTask, setIsNewTask] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // In a real app, this would be an actual API call
        // For now, we'll simulate with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockTasks: Task[] = [
          {
            id: 1,
            title: 'Complete ML assignment',
            description: 'Finish the machine learning homework for week 3',
            completed: false,
            dueDate: '2024-06-07',
            priority: 'High',
            tags: ['Course: ML', 'Assignment'],
            subtasks: [
              { id: 1, title: 'Implement linear regression', completed: true },
              { id: 2, title: 'Analyze results', completed: false },
              { id: 3, title: 'Write report', completed: false }
            ]
          },
          {
            id: 2,
            title: 'Review React components',
            description: 'Go through the component structure and optimize performance',
            completed: false,
            dueDate: '2024-06-08',
            priority: 'Medium',
            tags: ['Project: Dashboard', 'Frontend'],
            subtasks: [
              { id: 4, title: 'Audit component re-renders', completed: false },
              { id: 5, title: 'Implement memoization', completed: false }
            ]
          },
          {
            id: 3,
            title: 'Prepare for interview',
            description: 'Review common interview questions and practice coding challenges',
            completed: false,
            dueDate: '2024-06-10',
            priority: 'High',
            tags: ['Interview', 'Career'],
            subtasks: [
              { id: 6, title: 'Practice algorithms', completed: true },
              { id: 7, title: 'Review system design', completed: false },
              { id: 8, title: 'Mock interview', completed: false }
            ]
          },
          {
            id: 4,
            title: 'Read chapter 5 of Design Patterns book',
            completed: true,
            dueDate: '2024-06-03',
            priority: 'Low',
            tags: ['Reading', 'Learning']
          },
          {
            id: 5,
            title: 'Deploy application to production',
            description: 'Set up CI/CD pipeline and deploy to production environment',
            completed: false,
            dueDate: '2024-06-15',
            priority: 'Medium',
            tags: ['Project: E-commerce', 'DevOps']
          }
        ];
        
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    
    fetchTasks();
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setCurrentTask({...task});
      setIsNewTask(false);
    } else {
      setCurrentTask({
        title: '',
        description: '',
        completed: false,
        priority: 'Medium',
        tags: [],
        subtasks: []
      });
      setIsNewTask(true);
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentTask(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleDateChange = (date: Date | null) => {
    setCurrentTask(prev => ({
      ...prev,
      dueDate: date ? date.toISOString().split('T')[0] : undefined
    }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !currentTask.tags?.includes(tagInput.trim())) {
      setCurrentTask(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleDeleteTag = (tagToDelete: string) => {
    setCurrentTask(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToDelete)
    }));
  };
  
  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      const newSubtask = {
        id: Date.now(), // Use timestamp as temporary ID
        title: subtaskInput.trim(),
        completed: false
      };
      
      setCurrentTask(prev => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), newSubtask]
      }));
      setSubtaskInput('');
    }
  };
  
  const handleDeleteSubtask = (subtaskId: number) => {
    setCurrentTask(prev => ({
      ...prev,
      subtasks: prev.subtasks?.filter(subtask => subtask.id !== subtaskId)
    }));
  };
  
  const handleToggleSubtask = (subtaskId: number) => {
    setCurrentTask(prev => ({
      ...prev,
      subtasks: prev.subtasks?.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, completed: !subtask.completed } 
          : subtask
      )
    }));
  };
  
  const handleSaveTask = async () => {
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate saving
      
      if (isNewTask) {
        // Simulate adding a new task
        const newTask: Task = {
          ...currentTask as Task,
          id: Math.max(...tasks.map(t => t.id), 0) + 1,
          completed: false
        };
        setTasks([...tasks, newTask]);
      } else {
        // Simulate updating an existing task
        setTasks(tasks.map(task => 
          task.id === currentTask.id ? {...task, ...currentTask} : task
        ));
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  
  const handleDeleteTask = async (id: number) => {
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate deletion
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  const handleToggleTask = async (id: number) => {
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate toggling
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
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
  
  const getFilteredTasks = () => {
    switch (tabValue) {
      case 0: // Today
        const today = new Date().toISOString().split('T')[0];
        return tasks.filter(task => task.dueDate === today && !task.completed);
      case 1: // This Week
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(now);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return tasks.filter(task => {
          if (!task.dueDate || task.completed) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate >= weekStart && taskDate <= weekEnd;
        });
      case 2: // All
        return tasks.filter(task => !task.completed);
      case 3: // Completed
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };
  
  const filteredTasks = getFilteredTasks();
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">To-Do List</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Task
        </Button>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="task tabs">
          <Tab label="Today" />
          <Tab label="This Week" />
          <Tab label="All" />
          <Tab label="Completed" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        {renderTaskList(filteredTasks)}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderTaskList(filteredTasks)}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderTaskList(filteredTasks)}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderTaskList(filteredTasks)}
      </TabPanel>
      
      {/* Task Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isNewTask ? 'Add New Task' : 'Edit Task'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={currentTask.title}
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
                value={currentTask.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={currentTask.dueDate ? new Date(currentTask.dueDate) : null}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={currentTask.priority}
                  label="Priority"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                fullWidth
                margin="normal"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                    e.preventDefault();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                variant="outlined" 
                onClick={handleAddTag}
                sx={{ mt: 3 }}
                fullWidth
              >
                Add Tag
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {currentTask.tags?.map(tag => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    onDelete={() => handleDeleteTag(tag)}
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Subtasks</Typography>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TextField
                label="Add Subtask"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                fullWidth
                margin="normal"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSubtask();
                    e.preventDefault();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                variant="outlined" 
                onClick={handleAddSubtask}
                sx={{ mt: 3 }}
                fullWidth
              >
                Add Subtask
              </Button>
            </Grid>
            <Grid item xs={12}>
              <List>
                {currentTask.subtasks?.map(subtask => (
                  <ListItem key={subtask.id}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask.id)}
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={subtask.title}
                      sx={{ textDecoration: subtask.completed ? 'line-through' : 'none' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteSubtask(subtask.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  
  function renderTaskList(tasks: Task[]) {
    if (tasks.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No tasks to display. {tabValue !== 3 ? 'Add a new task to get started!' : 'Complete some tasks to see them here.'}
          </Typography>
        </Paper>
      );
    }
    
    return (
      <Paper>
        <List>
          {tasks.map(task => (
            <React.Fragment key={task.id}>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body1" 
                      sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                    >
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {task.description && (
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        {task.dueDate && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                        <Chip 
                          icon={<FlagIcon />}
                          label={task.priority} 
                          color={getPriorityColor(task.priority)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        {task.tags?.map(tag => (
                          <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                        ))}
                      </Box>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Subtasks: {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} completed
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleOpenDialog(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    );
  }
};

export default Tasks;


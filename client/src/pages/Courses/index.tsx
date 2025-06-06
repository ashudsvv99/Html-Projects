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
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import axios from 'axios';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  nextLesson?: {
    id: number;
    title: string;
  };
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    category: '',
    status: 'Not Started',
    totalLessons: 0,
    completedLessons: 0,
    progress: 0
  });
  const [isNewCourse, setIsNewCourse] = useState(true);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In a real app, this would be an actual API call
        // For now, we'll simulate with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockCourses: Course[] = [
          {
            id: 1,
            title: 'Machine Learning Fundamentals',
            description: 'Learn the basics of machine learning algorithms and applications.',
            category: 'Data Science',
            progress: 65,
            totalLessons: 20,
            completedLessons: 13,
            status: 'In Progress',
            nextLesson: {
              id: 14,
              title: 'Neural Networks Introduction'
            }
          },
          {
            id: 2,
            title: 'Advanced React Patterns',
            description: 'Master advanced React patterns and performance optimization techniques.',
            category: 'Web Development',
            progress: 40,
            totalLessons: 15,
            completedLessons: 6,
            status: 'In Progress',
            nextLesson: {
              id: 7,
              title: 'Compound Components'
            }
          },
          {
            id: 3,
            title: 'Data Structures & Algorithms',
            description: 'Comprehensive guide to data structures and algorithms with practical examples.',
            category: 'Computer Science',
            progress: 85,
            totalLessons: 30,
            completedLessons: 25,
            status: 'In Progress',
            nextLesson: {
              id: 26,
              title: 'Dynamic Programming Advanced'
            }
          },
          {
            id: 4,
            title: 'Cloud Architecture',
            description: 'Design scalable and resilient cloud architectures.',
            category: 'DevOps',
            progress: 0,
            totalLessons: 18,
            completedLessons: 0,
            status: 'Not Started'
          },
          {
            id: 5,
            title: 'UI/UX Design Principles',
            description: 'Learn fundamental principles of user interface and experience design.',
            category: 'Design',
            progress: 100,
            totalLessons: 12,
            completedLessons: 12,
            status: 'Completed'
          }
        ];
        
        setCourses(mockCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setCurrentCourse({...course});
      setIsNewCourse(false);
    } else {
      setCurrentCourse({
        title: '',
        description: '',
        category: '',
        status: 'Not Started',
        totalLessons: 0,
        completedLessons: 0,
        progress: 0
      });
      setIsNewCourse(true);
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentCourse(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSaveCourse = async () => {
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate saving
      
      if (isNewCourse) {
        // Simulate adding a new course
        const newCourse: Course = {
          ...currentCourse as Course,
          id: Math.max(...courses.map(c => c.id), 0) + 1,
          progress: 0,
          completedLessons: 0
        };
        setCourses([...courses, newCourse]);
      } else {
        // Simulate updating an existing course
        setCourses(courses.map(course => 
          course.id === currentCourse.id ? {...course, ...currentCourse} : course
        ));
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };
  
  const handleDeleteCourse = async (id: number) => {
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate deletion
      setCourses(courses.filter(course => course.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return 'default';
      case 'In Progress': return 'primary';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Courses</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Course
        </Button>
      </Box>
      
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {courses.map(course => (
            <Grid item xs={12} md={6} lg={4} key={course.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {course.title}
                    </Typography>
                    <Chip 
                      label={course.status} 
                      color={getStatusColor(course.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Category: {course.category}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">{course.progress}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </Typography>
                  </Box>
                  
                  {course.nextLesson && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="subtitle2">Next Lesson:</Typography>
                      <Typography variant="body2">{course.nextLesson.title}</Typography>
                    </Box>
                  )}
                </CardContent>
                
                <CardActions>
                  {course.status !== 'Completed' && (
                    <Button 
                      size="small" 
                      startIcon={<PlayArrowIcon />}
                      disabled={course.status === 'Not Started'}
                    >
                      Continue
                    </Button>
                  )}
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton size="small" onClick={() => handleOpenDialog(course)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteCourse(course.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Course Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isNewCourse ? 'Add New Course' : 'Edit Course'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={currentCourse.title}
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
                value={currentCourse.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                value={currentCourse.category}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentCourse.status}
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
              <TextField
                label="Total Lessons"
                name="totalLessons"
                type="number"
                value={currentCourse.totalLessons}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            {!isNewCourse && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Completed Lessons"
                  name="completedLessons"
                  type="number"
                  value={currentCourse.completedLessons}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCourse} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;


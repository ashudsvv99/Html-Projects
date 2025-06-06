import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress,
  Divider
} from '@mui/material';
import axios from 'axios';

interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingTasks: number;
  completedTasks: number;
  streak: number;
  xp: number;
}

interface CourseProgress {
  id: number;
  title: string;
  progress: number;
}

interface ProjectStatus {
  status: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    activeCourses: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    streak: 0,
    xp: 0
  });
  
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be actual API calls
        // For now, we'll simulate with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        setStats({
          totalCourses: 5,
          activeCourses: 3,
          totalProjects: 8,
          activeProjects: 4,
          completedProjects: 2,
          pendingTasks: 12,
          completedTasks: 45,
          streak: 7,
          xp: 1250
        });
        
        setCourseProgress([
          { id: 1, title: 'Machine Learning Fundamentals', progress: 65 },
          { id: 2, title: 'Advanced React Patterns', progress: 40 },
          { id: 3, title: 'Data Structures & Algorithms', progress: 85 }
        ]);
        
        setProjectStatus([
          { status: 'Not Started', count: 2 },
          { status: 'In Progress', count: 4 },
          { status: 'Completed', count: 2 }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* Quick Stats */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Overview</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Courses</Typography>
              <Typography variant="h3">{stats.activeCourses}</Typography>
              <Typography variant="body2" color="text.secondary">
                of {stats.totalCourses} total courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Projects</Typography>
              <Typography variant="h3">{stats.activeProjects}</Typography>
              <Typography variant="body2" color="text.secondary">
                of {stats.totalProjects} total projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>XP / Streak</Typography>
              <Typography variant="h3">{stats.xp}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.streak} day streak
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pending Tasks</Typography>
              <Typography variant="h3">{stats.pendingTasks}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.completedTasks} tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Today's Snapshot */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Today's Snapshot</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Upcoming Tasks</Typography>
            <Box>
              <Typography variant="body1">Complete ML assignment</Typography>
              <Typography variant="body2" color="text.secondary">Due today</Typography>
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="body1">Review React components</Typography>
              <Typography variant="body2" color="text.secondary">Due tomorrow</Typography>
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="body1">Prepare for interview</Typography>
              <Typography variant="body2" color="text.secondary">Due in 2 days</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Journal Highlights</Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">Yesterday's mood: 8/10</Typography>
              <Typography variant="body1">
                "Made good progress on the ML project. Need to focus more on algorithm optimization."
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Completed morning routine: 100%
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Habit Summary</Typography>
            <Box>
              <Typography variant="body1">Reading: 30 minutes</Typography>
              <Typography variant="body1">Coding: 2 hours</Typography>
              <Typography variant="body1">Exercise: Completed</Typography>
              <Typography variant="body1">Meditation: Completed</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Progress Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Progress</Typography>
      <Grid container spacing={3}>
        {/* Course Progress */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Course Progress</Typography>
            {courseProgress.map(course => (
              <Box key={course.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">{course.title}</Typography>
                  <Typography variant="body2">{course.progress}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={course.progress} 
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
        
        {/* Project Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Project Status</Typography>
            <Grid container spacing={2}>
              {projectStatus.map((status, index) => (
                <Grid item xs={4} key={index}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3">{status.count}</Typography>
                    <Typography variant="body2">{status.status}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;


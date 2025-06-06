import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const location = useLocation();
  
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Determine page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/courses')) return 'Courses';
    if (path.startsWith('/projects')) return 'Projects';
    if (path.startsWith('/interview-prep')) return 'Interview Preparation';
    if (path.startsWith('/tasks')) return 'To-Do List';
    if (path.startsWith('/notes')) return 'Notes';
    if (path.startsWith('/knowledge')) return 'Second Brain';
    if (path.startsWith('/journal')) return 'Daily Journal';
    
    return '360° Learning Platform';
  };
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Header 
        open={sidebarOpen} 
        onToggle={handleSidebarToggle} 
        title={getPageTitle()} 
      />
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 60}px)` },
          ml: { sm: `${sidebarOpen ? 240 : 60}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;


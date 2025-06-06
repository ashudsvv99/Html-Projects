import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as ProjectIcon,
  CheckCircle as TaskIcon,
  Note as NoteIcon,
  Book as JournalIcon,
  Psychology as KnowledgeIcon,
  QuestionAnswer as InterviewIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [learningOpen, setLearningOpen] = useState(true);
  const [organizationOpen, setOrganizationOpen] = useState(true);
  const [lifestyleOpen, setLifestyleOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLearningClick = () => {
    setLearningOpen(!learningOpen);
  };

  const handleOrganizationClick = () => {
    setOrganizationOpen(!organizationOpen);
  };

  const handleLifestyleClick = () => {
    setLifestyleOpen(!lifestyleOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        <ListItem 
          button 
          component={Link} 
          to="/" 
          selected={isActive('/')}
        >
          <ListItemIcon>
            <DashboardIcon color={isActive('/') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button onClick={handleLearningClick}>
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Learning" />
          {learningOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={learningOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              component={Link} 
              to="/courses" 
              selected={isActive('/courses')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <SchoolIcon color={isActive('/courses') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Courses" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/projects" 
              selected={isActive('/projects')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <ProjectIcon color={isActive('/projects') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/interview" 
              selected={isActive('/interview')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <InterviewIcon color={isActive('/interview') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Interview Prep" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={handleOrganizationClick}>
          <ListItemIcon>
            <TaskIcon />
          </ListItemIcon>
          <ListItemText primary="Organization" />
          {organizationOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={organizationOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              component={Link} 
              to="/tasks" 
              selected={isActive('/tasks')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <TaskIcon color={isActive('/tasks') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Tasks" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/notes" 
              selected={isActive('/notes')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <NoteIcon color={isActive('/notes') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Notes" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={handleLifestyleClick}>
          <ListItemIcon>
            <KnowledgeIcon />
          </ListItemIcon>
          <ListItemText primary="Lifestyle" />
          {lifestyleOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={lifestyleOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              component={Link} 
              to="/knowledge" 
              selected={isActive('/knowledge')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <KnowledgeIcon color={isActive('/knowledge') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Knowledge" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/journal" 
              selected={isActive('/journal')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <JournalIcon color={isActive('/journal') ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Journal" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Mobile menu button */}
      <Box sx={{ 
        position: 'fixed', 
        top: 10, 
        left: 10, 
        zIndex: 1100,
        display: { sm: 'none' } 
      }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            backgroundColor: 'background.paper',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: 'background.default',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default Sidebar;


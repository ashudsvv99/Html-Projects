import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  IconButton,
  Box,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Note as NoteIcon,
  Psychology as PsychologyIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  Task as TaskIcon,
  MenuBook as BookIcon,
  QuestionAnswer as QuestionIcon,
  AutoStories as JournalIcon,
  Lightbulb as IdeaIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  
  // State for expanded menu items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    learning: false,
    organization: false,
    lifestyle: false
  });
  
  const handleExpandClick = (section: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      color: theme.palette.info.main
    },
    {
      title: 'Learning',
      icon: <SchoolIcon />,
      section: 'learning',
      color: theme.palette.primary.main,
      subItems: [
        { title: 'Courses', icon: <BookIcon />, path: '/courses' },
        { title: 'Projects', icon: <AssignmentIcon />, path: '/projects' },
        { title: 'Interview Prep', icon: <QuestionIcon />, path: '/interview-prep' }
      ]
    },
    {
      title: 'Organization',
      icon: <TaskIcon />,
      section: 'organization',
      color: theme.palette.warning.main,
      subItems: [
        { title: 'To-Do List', icon: <TaskIcon />, path: '/tasks' },
        { title: 'Notes', icon: <NoteIcon />, path: '/notes' }
      ]
    },
    {
      title: 'Lifestyle Monitoring',
      icon: <PsychologyIcon />,
      section: 'lifestyle',
      color: theme.palette.success.main,
      subItems: [
        { title: 'Second Brain', icon: <IdeaIcon />, path: '/knowledge' },
        { title: 'Daily Journal', icon: <JournalIcon />, path: '/journal' }
      ]
    }
  ];
  
  const drawer = (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          padding: 1
        }}
      >
        <IconButton onClick={onToggle}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          item.subItems ? (
            <React.Fragment key={item.title}>
              <ListItem 
                button 
                onClick={() => handleExpandClick(item.section!)}
                sx={{ 
                  borderLeft: expandedItems[item.section!] ? `4px solid ${item.color}` : 'none',
                  pl: expandedItems[item.section!] ? 2 : 3
                }}
              >
                <ListItemIcon sx={{ color: item.color }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
                {expandedItems[item.section!] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={expandedItems[item.section!]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem 
                      button 
                      key={subItem.title} 
                      component={Link} 
                      to={subItem.path}
                      sx={{ 
                        pl: 4,
                        backgroundColor: isActive(subItem.path) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                        borderLeft: isActive(subItem.path) ? `4px solid ${item.color}` : 'none',
                        pl: isActive(subItem.path) ? 3 : 4
                      }}
                      onClick={() => isMobile && onToggle()}
                    >
                      <ListItemIcon sx={{ color: item.color }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={subItem.title} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem 
              button 
              key={item.title} 
              component={Link} 
              to={item.path!}
              sx={{ 
                backgroundColor: isActive(item.path!) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                borderLeft: isActive(item.path!) ? `4px solid ${item.color}` : 'none',
                pl: isActive(item.path!) ? 2 : 3
              }}
              onClick={() => isMobile && onToggle()}
            >
              <ListItemIcon sx={{ color: item.color }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          )
        ))}
      </List>
    </>
  );
  
  // Collapsed sidebar with only icons
  const collapsedDrawer = (
    <Box sx={{ width: 60, overflowX: 'hidden' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 1
        }}
      >
        <IconButton onClick={onToggle}>
          {theme.direction === 'ltr' ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          item.subItems ? (
            <Tooltip title={item.title} placement="right" key={item.title}>
              <ListItem 
                button 
                onClick={() => handleExpandClick(item.section!)}
                sx={{ 
                  justifyContent: 'center',
                  borderLeft: expandedItems[item.section!] ? `4px solid ${item.color}` : 'none',
                  pl: expandedItems[item.section!] ? 0 : 1
                }}
              >
                <ListItemIcon sx={{ color: item.color, minWidth: 'auto' }}>
                  {item.icon}
                </ListItemIcon>
              </ListItem>
            </Tooltip>
          ) : (
            <Tooltip title={item.title} placement="right" key={item.title}>
              <ListItem 
                button 
                component={Link} 
                to={item.path!}
                sx={{ 
                  justifyContent: 'center',
                  backgroundColor: isActive(item.path!) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  borderLeft: isActive(item.path!) ? `4px solid ${item.color}` : 'none',
                  pl: isActive(item.path!) ? 0 : 1
                }}
                onClick={() => isMobile && onToggle()}
              >
                <ListItemIcon sx={{ color: item.color, minWidth: 'auto' }}>
                  {item.icon}
                </ListItemIcon>
              </ListItem>
            </Tooltip>
          )
        ))}
      </List>
    </Box>
  );
  
  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={onToggle}
      sx={{
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 60,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {open ? drawer : collapsedDrawer}
    </Drawer>
  );
};

export default Sidebar;


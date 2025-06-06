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
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Folder as FolderIcon,
  Label as LabelIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  notebook: string;
  createdAt: string;
  updatedAt: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    tags: [],
    notebook: 'General'
  });
  const [isNewNote, setIsNewNote] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotebook, setSelectedNotebook] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // In a real app, this would be an actual API call
        // For now, we'll simulate with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockNotes: Note[] = [
          {
            id: 1,
            title: 'Machine Learning Concepts',
            content: '# Machine Learning Fundamentals\n\n## Supervised Learning\n- Classification\n- Regression\n\n## Unsupervised Learning\n- Clustering\n- Dimensionality Reduction\n\n## Key Algorithms\n- Linear Regression\n- Decision Trees\n- Neural Networks\n\n```python\n# Example code\ndef train_model(X, y):\n    model = LinearRegression()\n    model.fit(X, y)\n    return model\n```',
            tags: ['ML', 'AI', 'Learning'],
            notebook: 'Course Notes',
            createdAt: '2024-05-15T10:30:00Z',
            updatedAt: '2024-05-20T14:45:00Z'
          },
          {
            id: 2,
            title: 'React Performance Optimization',
            content: '# React Performance Tips\n\n## Memoization\nUse React.memo, useMemo, and useCallback to prevent unnecessary re-renders.\n\n## Code Splitting\nUse dynamic imports to split your code:\n\n```jsx\nconst LazyComponent = React.lazy(() => import(\'./LazyComponent\'));\n\nfunction MyComponent() {\n  return (\n    <React.Suspense fallback={<div>Loading...</div>}>\n      <LazyComponent />\n    </React.Suspense>\n  );\n}\n```\n\n## Virtual List\nFor long lists, use virtualization libraries like react-window.',
            tags: ['React', 'Frontend', 'Performance'],
            notebook: 'Project Notes',
            createdAt: '2024-05-18T09:15:00Z',
            updatedAt: '2024-05-18T09:15:00Z'
          },
          {
            id: 3,
            title: 'System Design Interview Prep',
            content: '# System Design Interview Preparation\n\n## Key Components\n1. **Requirements Clarification**\n   - Functional Requirements\n   - Non-Functional Requirements\n\n2. **Back-of-the-envelope Estimation**\n   - Traffic estimates\n   - Storage estimates\n   - Bandwidth estimates\n\n3. **System Interface Definition**\n   - API endpoints\n\n4. **Data Model**\n   - Schema design\n   - Database choice\n\n5. **High-level Design**\n   - Basic components\n\n6. **Detailed Design**\n   - Specific components and technologies\n\n7. **Bottlenecks and Mitigations**\n   - Single points of failure\n   - Scalability issues',
            tags: ['Interview', 'System Design', 'Architecture'],
            notebook: 'Interview Prep',
            createdAt: '2024-05-25T16:20:00Z',
            updatedAt: '2024-06-01T11:30:00Z'
          },
          {
            id: 4,
            title: 'Project Ideas',
            content: '# Future Project Ideas\n\n1. **Personal Finance Dashboard**\n   - Track expenses and investments\n   - Visualize spending patterns\n   - Set and monitor financial goals\n\n2. **Language Learning App**\n   - Spaced repetition for vocabulary\n   - Grammar exercises\n   - Speaking practice with AI\n\n3. **Health Monitoring System**\n   - Track fitness metrics\n   - Nutrition logging\n   - Sleep analysis\n\n4. **Smart Home Dashboard**\n   - Control IoT devices\n   - Automation rules\n   - Energy usage monitoring',
            tags: ['Ideas', 'Projects', 'Planning'],
            notebook: 'Ideas',
            createdAt: '2024-06-02T20:10:00Z',
            updatedAt: '2024-06-02T20:10:00Z'
          },
          {
            id: 5,
            title: 'Git Commands Cheatsheet',
            content: '# Git Commands Cheatsheet\n\n## Basic Commands\n\n```bash\n# Initialize a repository\ngit init\n\n# Clone a repository\ngit clone <repository-url>\n\n# Check status\ngit status\n\n# Add files to staging\ngit add <file>\ngit add .\n\n# Commit changes\ngit commit -m "Commit message"\n\n# Push changes\ngit push origin <branch>\n```\n\n## Branching\n\n```bash\n# Create a new branch\ngit branch <branch-name>\n\n# Switch to a branch\ngit checkout <branch-name>\n\n# Create and switch to a new branch\ngit checkout -b <branch-name>\n\n# Merge a branch\ngit merge <branch-name>\n```\n\n## Advanced\n\n```bash\n# Stash changes\ngit stash\ngit stash pop\n\n# Rebase\ngit rebase <branch>\n\n# Cherry-pick\ngit cherry-pick <commit-hash>\n```',
            tags: ['Git', 'DevOps', 'Cheatsheet'],
            notebook: 'Reference',
            createdAt: '2024-05-10T08:45:00Z',
            updatedAt: '2024-05-10T08:45:00Z'
          }
        ];
        
        setNotes(mockNotes);
        setFilteredNotes(mockNotes);
        
        // Extract unique notebooks and tags
        const uniqueNotebooks = Array.from(new Set(mockNotes.map(note => note.notebook)));
        const uniqueTags = Array.from(new Set(mockNotes.flatMap(note => note.tags)));
        
        setNotebooks(uniqueNotebooks);
        setTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    
    fetchNotes();
  }, []);
  
  useEffect(() => {
    filterNotes();
  }, [searchQuery, selectedNotebook, selectedTag, notes]);
  
  const filterNotes = () => {
    let filtered = [...notes];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
      );
    }
    
    // Filter by notebook
    if (selectedNotebook !== 'All') {
      filtered = filtered.filter(note => note.notebook === selectedNotebook);
    }
    
    // Filter by tag
    if (selectedTag !== 'All') {
      filtered = filtered.filter(note => note.tags.includes(selectedTag));
    }
    
    setFilteredNotes(filtered);
  };
  
  const handleOpenDialog = (note?: Note) => {
    if (note) {
      setCurrentNote({...note});
      setIsNewNote(false);
    } else {
      setCurrentNote({
        title: '',
        content: '',
        tags: [],
        notebook: notebooks.length > 0 ? notebooks[0] : 'General'
      });
      setIsNewNote(true);
    }
    setDialogOpen(true);
    setPreviewMode(false);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentNote(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotebookChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setCurrentNote(prev => ({
      ...prev,
      notebook: e.target.value as string
    }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !currentNote.tags?.includes(tagInput.trim())) {
      setCurrentNote(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleDeleteTag = (tagToDelete: string) => {
    setCurrentNote(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToDelete)
    }));
  };
  
  const handleSaveNote = async () => {
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate saving
      
      const now = new Date().toISOString();
      
      if (isNewNote) {
        // Simulate adding a new note
        const newNote: Note = {
          ...currentNote as Note,
          id: Math.max(...notes.map(n => n.id), 0) + 1,
          createdAt: now,
          updatedAt: now
        };
        setNotes([...notes, newNote]);
        
        // Add new notebook if it doesn't exist
        if (!notebooks.includes(newNote.notebook)) {
          setNotebooks([...notebooks, newNote.notebook]);
        }
        
        // Add new tags if they don't exist
        const newTags = newNote.tags.filter(tag => !tags.includes(tag));
        if (newTags.length > 0) {
          setTags([...tags, ...newTags]);
        }
      } else {
        // Simulate updating an existing note
        const updatedNotes = notes.map(note => 
          note.id === currentNote.id 
            ? {...note, ...currentNote, updatedAt: now} 
            : note
        );
        setNotes(updatedNotes);
        
        // Add new notebook if it doesn't exist
        if (currentNote.notebook && !notebooks.includes(currentNote.notebook)) {
          setNotebooks([...notebooks, currentNote.notebook]);
        }
        
        // Add new tags if they don't exist
        if (currentNote.tags) {
          const newTags = currentNote.tags.filter(tag => !tags.includes(tag));
          if (newTags.length > 0) {
            setTags([...tags, ...newTags]);
          }
        }
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };
  
  const handleDeleteNote = async (id: number) => {
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate deletion
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleNotebookFilter = (notebook: string) => {
    setSelectedNotebook(notebook);
  };
  
  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
  };
  
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Notes</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Note
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h6" gutterBottom>Notebooks</Typography>
            <List dense>
              <ListItem 
                button 
                selected={selectedNotebook === 'All'}
                onClick={() => handleNotebookFilter('All')}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="All Notebooks" />
              </ListItem>
              {notebooks.map(notebook => (
                <ListItem 
                  button 
                  key={notebook}
                  selected={selectedNotebook === notebook}
                  onClick={() => handleNotebookFilter(notebook)}
                >
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={notebook} />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>Tags</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <Chip 
                label="All Tags" 
                onClick={() => handleTagFilter('All')}
                color={selectedTag === 'All' ? 'primary' : 'default'}
                sx={{ mb: 0.5, mr: 0.5 }}
              />
              {tags.map(tag => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  onClick={() => handleTagFilter(tag)}
                  color={selectedTag === tag ? 'primary' : 'default'}
                  sx={{ mb: 0.5, mr: 0.5 }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
        
        {/* Notes Grid */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <Grid item xs={12} sm={6} md={4} key={note.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {note.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {note.content.substring(0, 100)}
                        {note.content.length > 100 ? '...' : ''}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {note.tags.map(tag => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Notebook: {note.notebook}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Updated: {new Date(note.updatedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => handleOpenDialog(note)}>
                        Open
                      </Button>
                      <Box sx={{ flexGrow: 1 }} />
                      <IconButton size="small" onClick={() => handleDeleteNote(note.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No notes found. {searchQuery || selectedNotebook !== 'All' || selectedTag !== 'All' 
                      ? 'Try adjusting your filters.' 
                      : 'Create your first note to get started!'}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      
      {/* Note Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isNewNote ? 'New Note' : 'Edit Note'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={currentNote.title}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Notebook"
                value={currentNote.notebook}
                onChange={handleNotebookChange}
                fullWidth
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                {notebooks.map(notebook => (
                  <option key={notebook} value={notebook}>
                    {notebook}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Notebook"
                placeholder="Or create a new notebook"
                value={
                  notebooks.includes(currentNote.notebook || '') 
                    ? '' 
                    : currentNote.notebook
                }
                onChange={(e) => setCurrentNote(prev => ({ ...prev, notebook: e.target.value }))}
                fullWidth
                margin="normal"
              />
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {currentNote.tags?.map(tag => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    onDelete={() => handleDeleteTag(tag)}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1">Content</Typography>
                <Button onClick={togglePreviewMode}>
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
              </Box>
              {previewMode ? (
                <Paper sx={{ p: 2, minHeight: 300, maxHeight: 500, overflow: 'auto' }}>
                  <ReactMarkdown>
                    {currentNote.content || ''}
                  </ReactMarkdown>
                </Paper>
              ) : (
                <TextField
                  name="content"
                  value={currentNote.content}
                  onChange={handleInputChange}
                  multiline
                  rows={15}
                  fullWidth
                  placeholder="# Markdown supported
                  
## Headings
**Bold text** and *italic text*

- Bullet points
- Another point

1. Numbered list
2. Second item

```
Code blocks
```

[Links](https://example.com)
                  "
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveNote} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notes;


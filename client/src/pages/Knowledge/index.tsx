import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FlashOn as FlashOnIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

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
      id={`knowledge-tabpanel-${index}`}
      aria-labelledby={`knowledge-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface ConceptCard {
  id: number;
  title: string;
  description: string;
  tags: string[];
  status: 'Draft' | 'Reviewed' | 'Riveted';
  relatedCourses: number[];
  relatedProjects: number[];
  relatedJournals: number[];
  createdAt: string;
  updatedAt: string;
}

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  deckId: number;
  lastReviewed: string | null;
  nextReview: string | null;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface Deck {
  id: number;
  name: string;
  description: string;
  cardsCount: number;
  reviewedCount: number;
}

interface Idea {
  id: number;
  content: string;
  category: string;
  createdAt: string;
}
const Knowledge: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [conceptCards, setConceptCards] = useState<ConceptCard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentDeck, setCurrentDeck] = useState<number | null>(null);
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  
  // Dialog states
  const [conceptDialogOpen, setConceptDialogOpen] = useState(false);
  const [deckDialogOpen, setDeckDialogOpen] = useState(false);
  const [flashcardDialogOpen, setFlashcardDialogOpen] = useState(false);
  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false);
  
  // Current editing items
  const [currentConcept, setCurrentConcept] = useState<Partial<ConceptCard>>({
    title: '',
    description: '',
    tags: [],
    status: 'Draft',
    relatedCourses: [],
    relatedProjects: [],
    relatedJournals: []
  });
  const [currentDeckEdit, setCurrentDeckEdit] = useState<Partial<Deck>>({
    name: '',
    description: ''
  });
  const [currentFlashcard, setCurrentFlashcard] = useState<Partial<Flashcard>>({
    question: '',
    answer: '',
    deckId: 0,
    difficulty: 'Medium'
  });
  const [currentIdea, setCurrentIdea] = useState<Partial<Idea>>({
    content: '',
    category: 'Future Project'
  });
  
  // For tag input
  const [tagInput, setTagInput] = useState('');
  
  // For related items
  const [availableCourses, setAvailableCourses] = useState<{id: number, title: string}[]>([]);
  const [availableProjects, setAvailableProjects] = useState<{id: number, title: string}[]>([]);
  
  useEffect(() => {
    fetchConceptCards();
    fetchDecks();
    fetchIdeas();
    fetchAvailableCourses();
    fetchAvailableProjects();
  }, []);
  
  useEffect(() => {
    if (currentDeck) {
      fetchFlashcards(currentDeck);
    }
  }, [currentDeck]);
  
  const fetchConceptCards = async () => {
    try {
      const response = await axios.get('/api/knowledge/concepts');
      setConceptCards(response.data);
    } catch (error) {
      console.error('Error fetching concept cards:', error);
    }
  };
  
  const fetchDecks = async () => {
    try {
      const response = await axios.get('/api/knowledge/decks');
      setDecks(response.data);
      if (response.data.length > 0 && !currentDeck) {
        setCurrentDeck(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  };
  
  const fetchFlashcards = async (deckId: number) => {
    try {
      const response = await axios.get(`/api/knowledge/decks/${deckId}/cards`);
      setFlashcards(response.data);
      setCurrentCard(0);
      setShowAnswer(false);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };
  
  const fetchIdeas = async () => {
    try {
      const response = await axios.get('/api/knowledge/ideas');
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
  };
  
  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setAvailableCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  
  const fetchAvailableProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setAvailableProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Concept Card Handlers
  const handleOpenConceptDialog = (concept?: ConceptCard) => {
    if (concept) {
      setCurrentConcept({...concept});
    } else {
      setCurrentConcept({
        title: '',
        description: '',
        tags: [],
        status: 'Draft',
        relatedCourses: [],
        relatedProjects: [],
        relatedJournals: []
      });
    }
    setConceptDialogOpen(true);
  };
  
  const handleCloseConceptDialog = () => {
    setConceptDialogOpen(false);
  };
  
  const handleConceptInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentConcept(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (e: any) => {
    setCurrentConcept(prev => ({
      ...prev,
      status: e.target.value
    }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !currentConcept.tags?.includes(tagInput.trim())) {
      setCurrentConcept(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleDeleteTag = (tagToDelete: string) => {
    setCurrentConcept(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToDelete)
    }));
  };
  
  const handleRelatedCoursesChange = (event: any, newValue: {id: number, title: string}[]) => {
    setCurrentConcept(prev => ({
      ...prev,
      relatedCourses: newValue.map(course => course.id)
    }));
  };
  
  const handleRelatedProjectsChange = (event: any, newValue: {id: number, title: string}[]) => {
    setCurrentConcept(prev => ({
      ...prev,
      relatedProjects: newValue.map(project => project.id)
    }));
  };
  const handleSaveConcept = async () => {
    try {
      if (currentConcept.id) {
        await axios.put(`/api/knowledge/concepts/${currentConcept.id}`, currentConcept);
      } else {
        await axios.post('/api/knowledge/concepts', currentConcept);
      }
      fetchConceptCards();
      handleCloseConceptDialog();
    } catch (error) {
      console.error('Error saving concept card:', error);
    }
  };
  
  const handleDeleteConcept = async (id: number) => {
    try {
      await axios.delete(`/api/knowledge/concepts/${id}`);
      fetchConceptCards();
    } catch (error) {
      console.error('Error deleting concept card:', error);
    }
  };
  
  // Deck Handlers
  const handleOpenDeckDialog = (deck?: Deck) => {
    if (deck) {
      setCurrentDeckEdit({...deck});
    } else {
      setCurrentDeckEdit({
        name: '',
        description: ''
      });
    }
    setDeckDialogOpen(true);
  };
  
  const handleCloseDeckDialog = () => {
    setDeckDialogOpen(false);
  };
  
  const handleDeckInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentDeckEdit(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveDeck = async () => {
    try {
      if (currentDeckEdit.id) {
        await axios.put(`/api/knowledge/decks/${currentDeckEdit.id}`, currentDeckEdit);
      } else {
        await axios.post('/api/knowledge/decks', currentDeckEdit);
      }
      fetchDecks();
      handleCloseDeckDialog();
    } catch (error) {
      console.error('Error saving deck:', error);
    }
  };
  
  const handleDeleteDeck = async (id: number) => {
    try {
      await axios.delete(`/api/knowledge/decks/${id}`);
      fetchDecks();
      if (currentDeck === id) {
        setCurrentDeck(null);
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
    }
  };
  
  // Flashcard Handlers
  const handleOpenFlashcardDialog = (card?: Flashcard) => {
    if (card) {
      setCurrentFlashcard({...card});
    } else {
      setCurrentFlashcard({
        question: '',
        answer: '',
        deckId: currentDeck || 0,
        difficulty: 'Medium'
      });
    }
    setFlashcardDialogOpen(true);
  };
  
  const handleCloseFlashcardDialog = () => {
    setFlashcardDialogOpen(false);
  };
  
  const handleFlashcardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentFlashcard(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDifficultyChange = (e: any) => {
    setCurrentFlashcard(prev => ({
      ...prev,
      difficulty: e.target.value
    }));
  };
  
  const handleSaveFlashcard = async () => {
    try {
      if (currentFlashcard.id) {
        await axios.put(`/api/knowledge/flashcards/${currentFlashcard.id}`, currentFlashcard);
      } else {
        await axios.post('/api/knowledge/flashcards', currentFlashcard);
      }
      if (currentDeck) {
        fetchFlashcards(currentDeck);
      }
      handleCloseFlashcardDialog();
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };
  
  const handleDeleteFlashcard = async (id: number) => {
    try {
      await axios.delete(`/api/knowledge/flashcards/${id}`);
      if (currentDeck) {
        fetchFlashcards(currentDeck);
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };
  
  // Flashcard Review Handlers
  const handleStartReview = () => {
    setIsReviewMode(true);
    setCurrentCard(0);
    setShowAnswer(false);
  };
  
  const handleEndReview = () => {
    setIsReviewMode(false);
  };
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleNextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setShowAnswer(false);
    } else {
      handleEndReview();
    }
  };
  
  const handleRecordDifficulty = async (cardId: number, difficulty: 'Easy' | 'Medium' | 'Hard') => {
    try {
      await axios.post(`/api/knowledge/flashcards/${cardId}/review`, { difficulty });
      handleNextCard();
    } catch (error) {
      console.error('Error recording flashcard review:', error);
    }
  };
  
  // Idea Handlers
  const handleOpenIdeaDialog = (idea?: Idea) => {
    if (idea) {
      setCurrentIdea({...idea});
    } else {
      setCurrentIdea({
        content: '',
        category: 'Future Project'
      });
    }
    setIdeaDialogOpen(true);
  };
  
  const handleCloseIdeaDialog = () => {
    setIdeaDialogOpen(false);
  };
  
  const handleIdeaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentIdea(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCategoryChange = (e: any) => {
    setCurrentIdea(prev => ({
      ...prev,
      category: e.target.value
    }));
  };
  
  const handleSaveIdea = async () => {
    try {
      if (currentIdea.id) {
        await axios.put(`/api/knowledge/ideas/${currentIdea.id}`, currentIdea);
      } else {
        await axios.post('/api/knowledge/ideas', currentIdea);
      }
      fetchIdeas();
      handleCloseIdeaDialog();
    } catch (error) {
      console.error('Error saving idea:', error);
    }
  };
  
  const handleDeleteIdea = async (id: number) => {
    try {
      await axios.delete(`/api/knowledge/ideas/${id}`);
      fetchIdeas();
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return '#ff9800'; // Orange
      case 'Reviewed': return '#2196f3'; // Blue
      case 'Riveted': return '#4caf50'; // Green
      default: return '#9e9e9e'; // Grey
    }
  };
  
  // Helper function to get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Future Project': return '#673ab7'; // Deep Purple
      case 'Research Idea': return '#2196f3'; // Blue
      case 'Blog Post': return '#009688'; // Teal
      case 'Learning Topic': return '#4caf50'; // Green
      default: return '#9e9e9e'; // Grey
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Knowledge Management</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="knowledge tabs">
          <Tab label="Knowledge Vault" id="knowledge-tab-0" aria-controls="knowledge-tabpanel-0" />
          <Tab label="Flashcards" id="knowledge-tab-1" aria-controls="knowledge-tabpanel-1" />
          <Tab label="Idea Incubator" id="knowledge-tab-2" aria-controls="knowledge-tabpanel-2" />
        </Tabs>
      </Box>
      
      {/* Knowledge Vault Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Concept Cards</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenConceptDialog()}
          >
            New Concept
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {conceptCards.map(concept => (
            <Grid item xs={12} sm={6} md={4} key={concept.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {concept.title}
                    </Typography>
                    <Chip 
                      label={concept.status} 
                      size="small"
                      sx={{ 
                        backgroundColor: getStatusColor(concept.status),
                        color: 'white'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {concept.description.substring(0, 150)}
                    {concept.description.length > 150 ? '...' : ''}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {concept.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                  {concept.relatedCourses.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Related Courses: {concept.relatedCourses.length}
                    </Typography>
                  )}
                  {concept.relatedProjects.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Related Projects: {concept.relatedProjects.length}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenConceptDialog(concept)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteConcept(concept.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Concept Dialog */}
        <Dialog open={conceptDialogOpen} onClose={handleCloseConceptDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {currentConcept.id ? 'Edit Concept' : 'New Concept'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={currentConcept.title}
                  onChange={handleConceptInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={currentConcept.description}
                  onChange={handleConceptInputChange}
                  multiline
                  rows={4}
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {currentConcept.tags?.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      onDelete={() => handleDeleteTag(tag)}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={currentConcept.status}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Reviewed">Reviewed</MenuItem>
                    <MenuItem value="Riveted">Riveted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Related Courses</Typography>
                <Autocomplete
                  multiple
                  options={availableCourses}
                  getOptionLabel={(option) => option.title}
                  value={availableCourses.filter(course => 
                    currentConcept.relatedCourses?.includes(course.id)
                  )}
                  onChange={handleRelatedCoursesChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select courses"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Related Projects</Typography>
                <Autocomplete
                  multiple
                  options={availableProjects}
                  getOptionLabel={(option) => option.title}
                  value={availableProjects.filter(project => 
                    currentConcept.relatedProjects?.includes(project.id)
                  )}
                  onChange={handleRelatedProjectsChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select projects"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConceptDialog}>Cancel</Button>
            <Button onClick={handleSaveConcept} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
      
      {/* Flashcards Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Flashcards</Typography>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDeckDialog()}
              sx={{ mr: 2 }}
            >
              New Deck
            </Button>
            {currentDeck && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenFlashcardDialog()}
              >
                New Flashcard
              </Button>
            )}
          </Box>
        </Box>
        
        {isReviewMode && flashcards.length > 0 ? (
          <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Card {currentCard + 1} of {flashcards.length}
              </Typography>
              <Typography variant="h5" sx={{ my: 4 }}>
                {flashcards[currentCard].question}
              </Typography>
              
              {showAnswer ? (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" sx={{ my: 4 }}>
                    {flashcards[currentCard].answer}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={() => handleRecordDifficulty(flashcards[currentCard].id, 'Easy')}
                    >
                      Easy
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleRecordDifficulty(flashcards[currentCard].id, 'Medium')}
                    >
                      Medium
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error"
                      onClick={() => handleRecordDifficulty(flashcards[currentCard].id, 'Hard')}
                    >
                      Hard
                    </Button>
                  </Box>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleShowAnswer}
                  sx={{ mt: 3 }}
                >
                  Show Answer
                </Button>
              )}
            </Paper>
            <Button 
              variant="outlined" 
              onClick={handleEndReview}
            >
              End Review
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Decks</Typography>
                  <List>
                    {decks.map(deck => (
                      <ListItem 
                        key={deck.id}
                        button
                        selected={currentDeck === deck.id}
                        onClick={() => setCurrentDeck(deck.id)}
                      >
                        <ListItemText 
                          primary={deck.name} 
                          secondary={`${deck.reviewedCount}/${deck.cardsCount} cards reviewed`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleOpenDeckDialog(deck)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDeleteDeck(deck.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  {currentDeck ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          {decks.find(d => d.id === currentDeck)?.name} Cards
                        </Typography>
                        {flashcards.length > 0 && (
                          <Button 
                            variant="contained" 
                            color="primary"
                            startIcon={<FlashOnIcon />}
                            onClick={handleStartReview}
                          >
                            Start Review
                          </Button>
                        )}
                      </Box>
                      
                      {flashcards.length > 0 ? (
                        <List>
                          {flashcards.map(card => (
                            <ListItem key={card.id}>
                              <ListItemText 
                                primary={card.question} 
                                secondary={`Last reviewed: ${card.lastReviewed ? new Date(card.lastReviewed).toLocaleDateString() : 'Never'}`}
                              />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleOpenFlashcardDialog(card)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleDeleteFlashcard(card.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                          No flashcards in this deck yet. Add some!
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      Select a deck or create a new one to get started
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
            
            {/* Deck Dialog */}
            <Dialog open={deckDialogOpen} onClose={handleCloseDeckDialog} maxWidth="sm" fullWidth>
              <DialogTitle>
                {currentDeckEdit.id ? 'Edit Deck' : 'New Deck'}
              </DialogTitle>
              <DialogContent dividers>
                <TextField
                  label="Deck Name"
                  name="name"
                  value={currentDeckEdit.name}
                  onChange={handleDeckInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Description"
                  name="description"
                  value={currentDeckEdit.description}
                  onChange={handleDeckInputChange}
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeckDialog}>Cancel</Button>
                <Button onClick={handleSaveDeck} variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
            
            {/* Flashcard Dialog */}
            <Dialog open={flashcardDialogOpen} onClose={handleCloseFlashcardDialog} maxWidth="md" fullWidth>
              <DialogTitle>
                {currentFlashcard.id ? 'Edit Flashcard' : 'New Flashcard'}
              </DialogTitle>
              <DialogContent dividers>
                <TextField
                  label="Question"
                  name="question"
                  value={currentFlashcard.question}
                  onChange={handleFlashcardInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Answer"
                  name="answer"
                  value={currentFlashcard.answer}
                  onChange={handleFlashcardInputChange}
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="difficulty-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-label"
                    value={currentFlashcard.difficulty}
                    label="Difficulty"
                    onChange={handleDifficultyChange}
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseFlashcardDialog}>Cancel</Button>
                <Button onClick={handleSaveFlashcard} variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </TabPanel>
      
      {/* Idea Incubator Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Idea Incubator</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenIdeaDialog()}
          >
            New Idea
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {ideas.map(idea => (
            <Grid item xs={12} sm={6} md={4} key={idea.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Chip 
                      label={idea.category} 
                      size="small"
                      sx={{ 
                        backgroundColor: getCategoryColor(idea.category),
                        color: 'white'
                      }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                    {idea.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(idea.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenIdeaDialog(idea)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteIdea(idea.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Idea Dialog */}
        <Dialog open={ideaDialogOpen} onClose={handleCloseIdeaDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {currentIdea.id ? 'Edit Idea' : 'New Idea'}
          </DialogTitle>
          <DialogContent dividers>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={currentIdea.category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="Future Project">Future Project</MenuItem>
                <MenuItem value="Research Idea">Research Idea</MenuItem>
                <MenuItem value="Blog Post">Blog Post</MenuItem>
                <MenuItem value="Learning Topic">Learning Topic</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Content"
              name="content"
              value={currentIdea.content}
              onChange={handleIdeaInputChange}
              multiline
              rows={6}
              fullWidth
              margin="normal"
              placeholder="Brain dump your ideas here..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseIdeaDialog}>Cancel</Button>
            <Button onClick={handleSaveIdea} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
    </Box>
  );
};

export default Knowledge;

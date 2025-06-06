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
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Architecture as ArchitectureIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
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
      id={`interview-tabpanel-${index}`}
      aria-labelledby={`interview-tab-${index}`}
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

interface Question {
  id: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  answer: string;
  notes: string;
  isReviewed: boolean;
  lastReviewed: string | null;
}

interface MockInterview {
  id: number;
  title: string;
  scheduledFor: string;
  duration: number;
  topics: string[];
  notes: string;
  isCompleted: boolean;
}

interface Resource {
  id: number;
  title: string;
  type: 'PDF' | 'Link' | 'Note';
  content: string;
  category: string;
}
const Interview: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mockInterviews, setMockInterviews] = useState<MockInterview[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [reviewMode, setReviewMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Dialog states
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  
  // Current editing items
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    category: 'Algorithms',
    difficulty: 'Medium',
    question: '',
    answer: '',
    notes: '',
    isReviewed: false
  });
  const [currentInterview, setCurrentInterview] = useState<Partial<MockInterview>>({
    title: '',
    scheduledFor: new Date().toISOString(),
    duration: 60,
    topics: [],
    notes: '',
    isCompleted: false
  });
  const [currentResource, setCurrentResource] = useState<Partial<Resource>>({
    title: '',
    type: 'Note',
    content: '',
    category: 'Algorithms'
  });
  
  // For topic input
  const [topicInput, setTopicInput] = useState('');
  
  useEffect(() => {
    fetchQuestions();
    fetchMockInterviews();
    fetchResources();
  }, []);
  
  useEffect(() => {
    filterQuestions();
  }, [questions, selectedCategory, selectedDifficulty]);
  
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/interview/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  
  const fetchMockInterviews = async () => {
    try {
      const response = await axios.get('/api/interview/mock-interviews');
      setMockInterviews(response.data);
    } catch (error) {
      console.error('Error fetching mock interviews:', error);
    }
  };
  
  const fetchResources = async () => {
    try {
      const response = await axios.get('/api/interview/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };
  
  const filterQuestions = () => {
    let filtered = [...questions];
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    
    setFilteredQuestions(filtered);
    
    // Reset review mode if no questions match the filter
    if (filtered.length === 0 && reviewMode) {
      setReviewMode(false);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategory(event.target.value as string);
  };
  
  const handleDifficultyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDifficulty(event.target.value as string);
  };
  
  // Question Handlers
  const handleOpenQuestionDialog = (question?: Question) => {
    if (question) {
      setCurrentQuestion({...question});
    } else {
      setCurrentQuestion({
        category: 'Algorithms',
        difficulty: 'Medium',
        question: '',
        answer: '',
        notes: '',
        isReviewed: false
      });
    }
    setQuestionDialogOpen(true);
  };
  
  const handleCloseQuestionDialog = () => {
    setQuestionDialogOpen(false);
  };
  
  const handleQuestionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleQuestionCategoryChange = (e: any) => {
    setCurrentQuestion(prev => ({
      ...prev,
      category: e.target.value
    }));
  };
  
  const handleQuestionDifficultyChange = (e: any) => {
    setCurrentQuestion(prev => ({
      ...prev,
      difficulty: e.target.value
    }));
  };
  
  const handleSaveQuestion = async () => {
    try {
      if (currentQuestion.id) {
        await axios.put(`/api/interview/questions/${currentQuestion.id}`, currentQuestion);
      } else {
        await axios.post('/api/interview/questions', currentQuestion);
      }
      fetchQuestions();
      handleCloseQuestionDialog();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };
  
  const handleDeleteQuestion = async (id: number) => {
    try {
      await axios.delete(`/api/interview/questions/${id}`);
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };
  
  const handleMarkAsReviewed = async (id: number, isReviewed: boolean) => {
    try {
      await axios.patch(`/api/interview/questions/${id}`, { isReviewed });
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question review status:', error);
    }
  };
  
  // Review Mode Handlers
  const handleStartReview = () => {
    if (filteredQuestions.length > 0) {
      setReviewMode(true);
      setCurrentQuestionIndex(0);
      setShowAnswer(false);
    }
  };
  
  const handleEndReview = () => {
    setReviewMode(false);
  };
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      handleEndReview();
    }
  };
  
  const handleMarkCurrentAsReviewed = async () => {
    const currentId = filteredQuestions[currentQuestionIndex].id;
    await handleMarkAsReviewed(currentId, true);
    handleNextQuestion();
  };
  // Mock Interview Handlers
  const handleOpenInterviewDialog = (interview?: MockInterview) => {
    if (interview) {
      setCurrentInterview({...interview});
    } else {
      setCurrentInterview({
        title: '',
        scheduledFor: new Date().toISOString(),
        duration: 60,
        topics: [],
        notes: '',
        isCompleted: false
      });
    }
    setInterviewDialogOpen(true);
  };
  
  const handleCloseInterviewDialog = () => {
    setInterviewDialogOpen(false);
  };
  
  const handleInterviewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentInterview(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCurrentInterview(prev => ({
        ...prev,
        scheduledFor: date.toISOString()
      }));
    }
  };
  
  const handleDurationChange = (e: any) => {
    setCurrentInterview(prev => ({
      ...prev,
      duration: Number(e.target.value)
    }));
  };
  
  const handleCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInterview(prev => ({
      ...prev,
      isCompleted: e.target.checked
    }));
  };
  
  const handleAddTopic = () => {
    if (topicInput.trim() && !currentInterview.topics?.includes(topicInput.trim())) {
      setCurrentInterview(prev => ({
        ...prev,
        topics: [...(prev.topics || []), topicInput.trim()]
      }));
      setTopicInput('');
    }
  };
  
  const handleDeleteTopic = (topicToDelete: string) => {
    setCurrentInterview(prev => ({
      ...prev,
      topics: prev.topics?.filter(topic => topic !== topicToDelete)
    }));
  };
  
  const handleSaveInterview = async () => {
    try {
      if (currentInterview.id) {
        await axios.put(`/api/interview/mock-interviews/${currentInterview.id}`, currentInterview);
      } else {
        await axios.post('/api/interview/mock-interviews', currentInterview);
      }
      fetchMockInterviews();
      handleCloseInterviewDialog();
    } catch (error) {
      console.error('Error saving mock interview:', error);
    }
  };
  
  const handleDeleteInterview = async (id: number) => {
    try {
      await axios.delete(`/api/interview/mock-interviews/${id}`);
      fetchMockInterviews();
    } catch (error) {
      console.error('Error deleting mock interview:', error);
    }
  };
  
  const handleToggleInterviewCompleted = async (id: number, isCompleted: boolean) => {
    try {
      await axios.patch(`/api/interview/mock-interviews/${id}`, { isCompleted });
      fetchMockInterviews();
    } catch (error) {
      console.error('Error updating mock interview status:', error);
    }
  };
  
  // Resource Handlers
  const handleOpenResourceDialog = (resource?: Resource) => {
    if (resource) {
      setCurrentResource({...resource});
    } else {
      setCurrentResource({
        title: '',
        type: 'Note',
        content: '',
        category: 'Algorithms'
      });
    }
    setResourceDialogOpen(true);
  };
  
  const handleCloseResourceDialog = () => {
    setResourceDialogOpen(false);
  };
  
  const handleResourceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentResource(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleResourceTypeChange = (e: any) => {
    setCurrentResource(prev => ({
      ...prev,
      type: e.target.value
    }));
  };
  
  const handleResourceCategoryChange = (e: any) => {
    setCurrentResource(prev => ({
      ...prev,
      category: e.target.value
    }));
  };
  
  const handleSaveResource = async () => {
    try {
      if (currentResource.id) {
        await axios.put(`/api/interview/resources/${currentResource.id}`, currentResource);
      } else {
        await axios.post('/api/interview/resources', currentResource);
      }
      fetchResources();
      handleCloseResourceDialog();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };
  
  const handleDeleteResource = async (id: number) => {
    try {
      await axios.delete(`/api/interview/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };
  
  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Algorithms':
        return <CodeIcon />;
      case 'Data Structures':
        return <StorageIcon />;
      case 'System Design':
        return <ArchitectureIcon />;
      case 'Behavioral':
        return <PsychologyIcon />;
      default:
        return <DescriptionIcon />;
    }
  };
  
  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4caf50'; // Green
      case 'Medium': return '#ff9800'; // Orange
      case 'Hard': return '#f44336'; // Red
      default: return '#9e9e9e'; // Grey
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Interview Preparation</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="interview tabs">
          <Tab label="Question Bank" id="interview-tab-0" aria-controls="interview-tabpanel-0" />
          <Tab label="Mock Interviews" id="interview-tab-1" aria-controls="interview-tabpanel-1" />
          <Tab label="Resources & Notes" id="interview-tab-2" aria-controls="interview-tabpanel-2" />
        </Tabs>
      </Box>
      
      {/* Question Bank Tab */}
      <TabPanel value={tabValue} index={0}>
        {reviewMode ? (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </Typography>
              <Button variant="outlined" onClick={handleEndReview}>
                End Review
              </Button>
            </Box>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip 
                  icon={getCategoryIcon(filteredQuestions[currentQuestionIndex].category)}
                  label={filteredQuestions[currentQuestionIndex].category} 
                />
                <Chip 
                  label={filteredQuestions[currentQuestionIndex].difficulty} 
                  sx={{ 
                    backgroundColor: getDifficultyColor(filteredQuestions[currentQuestionIndex].difficulty),
                    color: 'white'
                  }}
                />
              </Box>
              
              <Typography variant="h6" gutterBottom>
                {filteredQuestions[currentQuestionIndex].question}
              </Typography>
              
              {showAnswer ? (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>Answer:</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
                    {filteredQuestions[currentQuestionIndex].answer}
                  </Typography>
                  
                  {filteredQuestions[currentQuestionIndex].notes && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>Notes:</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {filteredQuestions[currentQuestionIndex].notes}
                      </Typography>
                    </>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleMarkCurrentAsReviewed}
                      startIcon={<CheckIcon />}
                    >
                      Mark as Reviewed & Next
                    </Button>
                    <Button 
                      variant="outlined"
                      onClick={handleNextQuestion}
                    >
                      Next Question
                    </Button>
                  </Box>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleShowAnswer}
                  sx={{ mt: 3 }}
                  fullWidth
                >
                  Show Answer
                </Button>
              )}
            </Paper>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Question Bank</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenQuestionDialog()}
              >
                Add Question
              </Button>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="category-filter-label">Category</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    value={selectedCategory}
                    label="Category"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value="All">All Categories</MenuItem>
                    <MenuItem value="Algorithms">Algorithms</MenuItem>
                    <MenuItem value="Data Structures">Data Structures</MenuItem>
                    <MenuItem value="System Design">System Design</MenuItem>
                    <MenuItem value="Behavioral">Behavioral</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="difficulty-filter-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-filter-label"
                    value={selectedDifficulty}
                    label="Difficulty"
                    onChange={handleDifficultyChange}
                  >
                    <MenuItem value="All">All Difficulties</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleStartReview}
                  disabled={filteredQuestions.length === 0}
                  fullWidth
                  sx={{ height: '56px' }}
                >
                  Start Review
                </Button>
              </Grid>
            </Grid>
            
            {filteredQuestions.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Question</TableCell>
                      <TableCell>Difficulty</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredQuestions.map(question => (
                      <TableRow key={question.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getCategoryIcon(question.category)}
                            <Typography sx={{ ml: 1 }}>{question.category}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{question.question.substring(0, 50)}{question.question.length > 50 ? '...' : ''}</TableCell>
                        <TableCell>
                          <Chip 
                            label={question.difficulty} 
                            size="small"
                            sx={{ 
                              backgroundColor: getDifficultyColor(question.difficulty),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={question.isReviewed ? 'Reviewed' : 'Not Reviewed'} 
                            color={question.isReviewed ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenQuestionDialog(question)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteQuestion(question.id)}>
                            <DeleteIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleMarkAsReviewed(question.id, !question.isReviewed)}
                            color={question.isReviewed ? 'default' : 'primary'}
                          >
                            <CheckIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No questions match your filters. Try adjusting your criteria or add a new question.
                </Typography>
              </Paper>
            )}
            
            {/* Question Dialog */}
            <Dialog open={questionDialogOpen} onClose={handleCloseQuestionDialog} maxWidth="md" fullWidth>
              <DialogTitle>
                {currentQuestion.id ? 'Edit Question' : 'Add New Question'}
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="question-category-label">Category</InputLabel>
                      <Select
                        labelId="question-category-label"
                        value={currentQuestion.category}
                        label="Category"
                        onChange={handleQuestionCategoryChange}
                      >
                        <MenuItem value="Algorithms">Algorithms</MenuItem>
                        <MenuItem value="Data Structures">Data Structures</MenuItem>
                        <MenuItem value="System Design">System Design</MenuItem>
                        <MenuItem value="Behavioral">Behavioral</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="question-difficulty-label">Difficulty</InputLabel>
                      <Select
                        labelId="question-difficulty-label"
                        value={currentQuestion.difficulty}
                        label="Difficulty"
                        onChange={handleQuestionDifficultyChange}
                      >
                        <MenuItem value="Easy">Easy</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Question"
                      name="question"
                      value={currentQuestion.question}
                      onChange={handleQuestionInputChange}
                      multiline
                      rows={3}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Answer"
                      name="answer"
                      value={currentQuestion.answer}
                      onChange={handleQuestionInputChange}
                      multiline
                      rows={6}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Notes (optional)"
                      name="notes"
                      value={currentQuestion.notes}
                      onChange={handleQuestionInputChange}
                      multiline
                      rows={3}
                      fullWidth
                      margin="normal"
                      placeholder="Add any additional notes, hints, or references here"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentQuestion.isReviewed}
                          onChange={(e) => setCurrentQuestion(prev => ({
                            ...prev,
                            isReviewed: e.target.checked
                          }))}
                        />
                      }
                      label="Mark as reviewed"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseQuestionDialog}>Cancel</Button>
                <Button onClick={handleSaveQuestion} variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </TabPanel>
      
      {/* Mock Interviews Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Mock Interview Scheduler</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenInterviewDialog()}
          >
            Schedule Interview
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {mockInterviews.map(interview => (
            <Grid item xs={12} sm={6} md={4} key={interview.id}>
              <Card sx={{ 
                height: '100%',
                borderLeft: `5px solid ${interview.isCompleted ? '#4caf50' : '#2196f3'}`
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {interview.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {new Date(interview.scheduledFor).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Duration: {interview.duration} minutes
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>Topics:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {interview.topics.map(topic => (
                      <Chip key={topic} label={topic} size="small" />
                    ))}
                  </Box>
                  {interview.notes && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>Notes:</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {interview.notes}
                      </Typography>
                    </>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenInterviewDialog(interview)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteInterview(interview.id)}>
                    Delete
                  </Button>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={interview.isCompleted}
                        onChange={(e) => handleToggleInterviewCompleted(interview.id, e.target.checked)}
                        size="small"
                      />
                    }
                    label="Completed"
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {mockInterviews.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No mock interviews scheduled. Click the button above to schedule your first interview.
            </Typography>
          </Paper>
        )}
        
        {/* Mock Interview Dialog */}
        <Dialog open={interviewDialogOpen} onClose={handleCloseInterviewDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {currentInterview.id ? 'Edit Mock Interview' : 'Schedule Mock Interview'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={currentInterview.title}
                  onChange={handleInterviewInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Date & Time"
                    value={new Date(currentInterview.scheduledFor || '')}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="duration-label">Duration (minutes)</InputLabel>
                  <Select
                    labelId="duration-label"
                    value={currentInterview.duration}
                    label="Duration (minutes)"
                    onChange={handleDurationChange}
                  >
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={45}>45 minutes</MenuItem>
                    <MenuItem value={60}>60 minutes</MenuItem>
                    <MenuItem value={90}>90 minutes</MenuItem>
                    <MenuItem value={120}>120 minutes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Add Topic"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  fullWidth
                  margin="normal"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTopic();
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button 
                  variant="outlined" 
                  onClick={handleAddTopic}
                  sx={{ mt: 3 }}
                  fullWidth
                >
                  Add Topic
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {currentInterview.topics?.map(topic => (
                    <Chip 
                      key={topic} 
                      label={topic} 
                      onDelete={() => handleDeleteTopic(topic)}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={currentInterview.notes}
                  onChange={handleInterviewInputChange}
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  placeholder="Add any preparation notes or focus areas"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentInterview.isCompleted}
                      onChange={handleCompletedChange}
                    />
                  }
                  label="Mark as completed"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInterviewDialog}>Cancel</Button>
            <Button onClick={handleSaveInterview} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
      
      {/* Resources Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Resources & Notes</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenResourceDialog()}
          >
            Add Resource
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {resources.map(resource => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {resource.title}
                    </Typography>
                    <Chip 
                      label={resource.type} 
                      size="small"
                      color={resource.type === 'PDF' ? 'error' : resource.type === 'Link' ? 'primary' : 'default'}
                    />
                  </Box>
                  <Chip 
                    icon={getCategoryIcon(resource.category)}
                    label={resource.category} 
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Divider sx={{ my: 1 }} />
                  {resource.type === 'Note' ? (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {resource.content.substring(0, 150)}
                      {resource.content.length > 150 ? '...' : ''}
                    </Typography>
                  ) : resource.type === 'Link' ? (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      component="a" 
                      href={resource.content} 
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mt: 1 }}
                    >
                      Open Link
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      component="a" 
                      href={resource.content} 
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mt: 1 }}
                    >
                      View PDF
                    </Button>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenResourceDialog(resource)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteResource(resource.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {resources.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No resources added yet. Click the button above to add your first resource.
            </Typography>
          </Paper>
        )}
        
        {/* Resource Dialog */}
        <Dialog open={resourceDialogOpen} onClose={handleCloseResourceDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {currentResource.id ? 'Edit Resource' : 'Add New Resource'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={currentResource.title}
                  onChange={handleResourceInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="resource-type-label">Type</InputLabel>
                  <Select
                    labelId="resource-type-label"
                    value={currentResource.type}
                    label="Type"
                    onChange={handleResourceTypeChange}
                  >
                    <MenuItem value="Note">Note</MenuItem>
                    <MenuItem value="Link">Link</MenuItem>
                    <MenuItem value="PDF">PDF</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="resource-category-label">Category</InputLabel>
                  <Select
                    labelId="resource-category-label"
                    value={currentResource.category}
                    label="Category"
                    onChange={handleResourceCategoryChange}
                  >
                    <MenuItem value="Algorithms">Algorithms</MenuItem>
                    <MenuItem value="Data Structures">Data Structures</MenuItem>
                    <MenuItem value="System Design">System Design</MenuItem>
                    <MenuItem value="Behavioral">Behavioral</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {currentResource.type === 'Note' ? (
                  <TextField
                    label="Content"
                    name="content"
                    value={currentResource.content}
                    onChange={handleResourceInputChange}
                    multiline
                    rows={6}
                    fullWidth
                    margin="normal"
                    required
                  />
                ) : (
                  <TextField
                    label={currentResource.type === 'Link' ? 'URL' : 'PDF URL'}
                    name="content"
                    value={currentResource.content}
                    onChange={handleResourceInputChange}
                    fullWidth
                    margin="normal"
                    required
                    placeholder={currentResource.type === 'Link' ? 'https://example.com' : 'https://example.com/document.pdf'}
                  />
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResourceDialog}>Cancel</Button>
            <Button onClick={handleSaveResource} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
    </Box>
  );
};

export default Interview;

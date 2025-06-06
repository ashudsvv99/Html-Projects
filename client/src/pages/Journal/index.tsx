import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  FormControl, 
  FormControlLabel, 
  Checkbox, 
  Slider, 
  Divider,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

interface JournalEntry {
  id: number;
  date: string;
  morningChecklist: {
    wakeupRitual: boolean;
    exercise: boolean;
    breakfast: boolean;
    hydration: boolean;
    studyPlanned: boolean;
    studySubject?: string;
    studyDuration?: number;
  };
  dailyPractices: {
    readingMinutes: number;
    learningMinutes: number;
    journaling: boolean;
    gratitudeLog: string[];
  };
  eveningChecklist: {
    goalsReview: boolean;
    meditation: boolean;
    sleepPrep: boolean;
  };
  mood: number;
  energy: number;
  notes: string;
}

const emptyJournalEntry: JournalEntry = {
  id: 0,
  date: moment().format('YYYY-MM-DD'),
  morningChecklist: {
    wakeupRitual: false,
    exercise: false,
    breakfast: false,
    hydration: false,
    studyPlanned: false,
    studySubject: '',
    studyDuration: 0
  },
  dailyPractices: {
    readingMinutes: 0,
    learningMinutes: 0,
    journaling: false,
    gratitudeLog: ['', '', '']
  },
  eveningChecklist: {
    goalsReview: false,
    meditation: false,
    sleepPrep: false
  },
  mood: 5,
  energy: 5,
  notes: ''
};
const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({...emptyJournalEntry});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewEntry, setIsNewEntry] = useState(true);
  const [calendarView, setCalendarView] = useState(true);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const response = await axios.get('/api/journal');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const handleOpenDialog = (entry?: JournalEntry) => {
    if (entry) {
      setCurrentEntry({...entry});
      setIsNewEntry(false);
    } else {
      setCurrentEntry({
        ...emptyJournalEntry,
        date: moment().format('YYYY-MM-DD')
      });
      setIsNewEntry(true);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setCurrentEntry(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof JournalEntry],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setCurrentEntry(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    setCurrentEntry(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitudeLog = [...currentEntry.dailyPractices.gratitudeLog];
    newGratitudeLog[index] = value;
    
    setCurrentEntry(prev => ({
      ...prev,
      dailyPractices: {
        ...prev.dailyPractices,
        gratitudeLog: newGratitudeLog
      }
    }));
  };
  const handleSaveEntry = async () => {
    try {
      if (isNewEntry) {
        await axios.post('/api/journal', currentEntry);
      } else {
        await axios.put(`/api/journal/${currentEntry.id}`, currentEntry);
      }
      fetchJournalEntries();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    try {
      await axios.delete(`/api/journal/${id}`);
      fetchJournalEntries();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  const getEntryColor = (entry: JournalEntry) => {
    // Calculate completion score based on checklists
    const morningItems = Object.values(entry.morningChecklist).filter(val => typeof val === 'boolean').length;
    const morningCompleted = Object.values(entry.morningChecklist).filter(val => val === true).length;
    
    const eveningItems = Object.values(entry.eveningChecklist).length;
    const eveningCompleted = Object.values(entry.eveningChecklist).filter(val => val === true).length;
    
    const totalItems = morningItems + eveningItems + 1; // +1 for journaling
    const totalCompleted = morningCompleted + eveningCompleted + (entry.dailyPractices.journaling ? 1 : 0);
    
    const completionPercentage = (totalCompleted / totalItems) * 100;
    
    if (completionPercentage >= 80) return '#4caf50'; // Green
    if (completionPercentage >= 50) return '#ff9800'; // Yellow/Orange
    return '#f44336'; // Red
  };

  const calendarEvents = entries.map(entry => ({
    id: entry.id,
    title: `Mood: ${entry.mood}/10, Energy: ${entry.energy}/10`,
    start: new Date(entry.date),
    end: new Date(entry.date),
    allDay: true,
    resource: entry
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Daily Journal Tracking</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={calendarView ? <CalendarIcon /> : <CalendarIcon />}
            onClick={() => setCalendarView(!calendarView)}
            sx={{ mr: 2 }}
          >
            {calendarView ? 'List View' : 'Calendar View'}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Entry
          </Button>
        </Box>
      </Box>

      {calendarView ? (
        <Paper sx={{ p: 2, height: 'calc(100vh - 200px)' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: getEntryColor(event.resource),
              },
            })}
            onSelectEvent={(event) => handleOpenDialog(event.resource)}
          />
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {entries.map(entry => (
            <Grid item xs={12} sm={6} md={4} key={entry.id}>
              <Card sx={{ 
                borderLeft: `5px solid ${getEntryColor(entry)}`,
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {moment(entry.date).format('MMMM D, YYYY')}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Mood: {entry.mood}/10</Typography>
                    <Typography variant="body2">Energy: {entry.energy}/10</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" noWrap>
                    {entry.notes.substring(0, 100)}{entry.notes.length > 100 ? '...' : ''}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenDialog(entry)}>
                    View/Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteEntry(entry.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Journal Entry Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isNewEntry ? 'New Journal Entry' : 'Edit Journal Entry'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                name="date"
                value={currentEntry.date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Morning Checklist */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Morning Checklist</Typography>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentEntry.morningChecklist.wakeupRitual}
                          onChange={handleInputChange}
                          name="morningChecklist.wakeupRitual"
                        />
                      }
                      label="Wake-up Ritual Complete"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentEntry.morningChecklist.exercise}
                          onChange={handleInputChange}
                          name="morningChecklist.exercise"
                        />
                      }
                      label="Exercise Done"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentEntry.morningChecklist.breakfast}
                          onChange={handleInputChange}
                          name="morningChecklist.breakfast"
                        />
                      }
                      label="Breakfast"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentEntry.morningChecklist.hydration}
                          onChange={handleInputChange}
                          name="morningChecklist.hydration"
                        />
                      }
                      label="Hydration"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentEntry.morningChecklist.studyPlanned}
                          onChange={handleInputChange}
                          name="morningChecklist.studyPlanned"
                        />
                      }
                      label="Study Session Planned"
                    />
                  </Grid>
                  {currentEntry.morningChecklist.studyPlanned && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Study Subject"
                          name="morningChecklist.studySubject"
                          value={currentEntry.morningChecklist.studySubject || ''}
                          onChange={handleInputChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Duration (minutes)"
                          name="morningChecklist.studyDuration"
                          type="number"
                          value={currentEntry.morningChecklist.studyDuration || 0}
                          onChange={handleInputChange}
                          fullWidth
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Daily Practices */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Daily Practices</Typography>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Reading (minutes)"
                      name="dailyPractices.readingMinutes"
                      type="number"
                      value={currentEntry.dailyPractices.readingMinutes}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Learning/Coding (minutes)"
                      name="dailyPractices.learningMinutes"
                      type="number"
                      value={currentEntry.dailyPractices.learningMinutes}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentEntry.dailyPractices.journaling}
                          onChange={handleInputChange}
                          name="dailyPractices.journaling"
                        />
                      }
                      label="Journaling"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>Gratitude Log (Three Things)</Typography>
                    {currentEntry.dailyPractices.gratitudeLog.map((item, index) => (
                      <TextField
                        key={index}
                        label={`Gratitude ${index + 1}`}
                        value={item}
                        onChange={(e) => handleGratitudeChange(index, e.target.value)}
                        fullWidth
                        margin="dense"
                      />
                    ))}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Evening Checklist */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Evening Checklist</Typography>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentEntry.eveningChecklist.goalsReview}
                          onChange={handleInputChange}
                          name="eveningChecklist.goalsReview"
                        />
                      }
                      label="Review of Goals"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentEntry.eveningChecklist.meditation}
                          onChange={handleInputChange}
                          name="eveningChecklist.meditation"
                        />
                      }
                      label="Meditation/Prayer"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentEntry.eveningChecklist.sleepPrep}
                          onChange={handleInputChange}
                          name="eveningChecklist.sleepPrep"
                        />
                      }
                      label="Sleep Prep"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Mood & Energy */}
            <Grid item xs={12} sm={6}>
              <Typography id="mood-slider" gutterBottom>
                Mood Rating: {currentEntry.mood}/10
              </Typography>
              <Slider
                value={currentEntry.mood}
                onChange={handleSliderChange('mood')}
                aria-labelledby="mood-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography id="energy-slider" gutterBottom>
                Energy Rating: {currentEntry.energy}/10
              </Typography>
              <Slider
                value={currentEntry.energy}
                onChange={handleSliderChange('energy')}
                aria-labelledby="energy-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                label="Notes & Reflections"
                name="notes"
                value={currentEntry.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveEntry} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Journal;

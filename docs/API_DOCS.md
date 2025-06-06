# API Documentation - 360° Learning and Tracking Platform

This document outlines the API endpoints available in the 360° Learning and Tracking Platform.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Most API endpoints require authentication. Include the authentication token in the request header:

```
Authorization: Bearer YOUR_TOKEN
```

## Response Format

All responses are returned in JSON format with the following structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

For errors:

```json
{
  "success": false,
  "error": "Error message",
  "code": 400
}
```

## API Endpoints

### Dashboard

#### Get Dashboard Data

```
GET /api/dashboard
```

Returns all data needed for the dashboard, including:
- Quick stats (courses count, active projects, XP, pending todos)
- Today's snapshot
- Progress data

**Response Example:**

```json
{
  "success": true,
  "data": {
    "quickStats": {
      "coursesCount": 5,
      "activeProjects": 3,
      "xp": 1250,
      "streak": 7,
      "pendingTodos": 4
    },
    "todaySnapshot": {
      "upcomingTasks": [...],
      "journalHighlights": {...},
      "habitSummary": {...}
    },
    "progress": {
      "courses": [...],
      "projects": {...},
      "lifestyle": {...}
    }
  }
}
```

### Courses

#### Get All Courses

```
GET /api/courses
```

Returns a list of all courses.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| status    | string | Filter by status (active, completed, all) |
| category  | string | Filter by category |
| limit     | number | Limit the number of results |
| offset    | number | Offset for pagination |

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Machine Learning Fundamentals",
      "description": "Introduction to ML concepts",
      "category": "Data Science",
      "totalLessons": 12,
      "completedLessons": 5,
      "progress": 41.67,
      "startDate": "2023-01-15",
      "expectedEndDate": "2023-03-15",
      "status": "active"
    },
    ...
  ],
  "count": 5,
  "total": 10
}
```

#### Get Course by ID

```
GET /api/courses/:id
```

Returns details for a specific course.

**Response Example:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Machine Learning Fundamentals",
    "description": "Introduction to ML concepts",
    "category": "Data Science",
    "lessons": [
      {
        "id": 1,
        "title": "Introduction to ML",
        "isCompleted": true,
        "completedDate": "2023-01-20"
      },
      ...
    ],
    "quizzes": [...],
    "progress": 41.67,
    "startDate": "2023-01-15",
    "expectedEndDate": "2023-03-15",
    "status": "active"
  }
}
```

#### Create Course

```
POST /api/courses
```

Creates a new course.

**Request Body:**

```json
{
  "title": "Deep Learning Specialization",
  "description": "Advanced neural network architectures",
  "category": "Data Science",
  "totalLessons": 15,
  "startDate": "2023-04-01",
  "expectedEndDate": "2023-06-30"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 6,
    "title": "Deep Learning Specialization",
    ...
  },
  "message": "Course created successfully"
}
```

#### Update Course

```
PUT /api/courses/:id
```

Updates an existing course.

**Request Body:**

```json
{
  "title": "Deep Learning Specialization - Updated",
  "description": "Updated description",
  ...
}
```

#### Delete Course

```
DELETE /api/courses/:id
```

Deletes a course.

### Projects

#### Get All Projects

```
GET /api/projects
```

Returns a list of all projects.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| status    | string | Filter by status (not_started, in_progress, completed) |
| category  | string | Filter by category |
| priority  | string | Filter by priority (high, medium, low) |
| limit     | number | Limit the number of results |
| offset    | number | Offset for pagination |

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Build a sentiment analysis app",
      "description": "Web application that analyzes sentiment in social media posts",
      "status": "in_progress",
      "priority": "high",
      "progress": 65,
      "startDate": "2023-01-15",
      "category": "Natural Language Processing",
      "techStack": ["Python", "Flask", "NLTK", "scikit-learn", "GitHub"]
    },
    ...
  ],
  "count": 3,
  "total": 5
}
```

#### Get Project by ID

```
GET /api/projects/:id
```

Returns details for a specific project.

#### Create Project

```
POST /api/projects
```

Creates a new project.

**Request Body:**

```json
{
  "title": "Build a recommendation system",
  "description": "Create a movie recommendation system using collaborative filtering",
  "status": "not_started",
  "priority": "medium",
  "category": "Machine Learning",
  "techStack": ["Python", "TensorFlow", "Flask", "MongoDB"],
  "startDate": "2023-05-01"
}
```

#### Update Project

```
PUT /api/projects/:id
```

Updates an existing project.

#### Delete Project

```
DELETE /api/projects/:id
```

Deletes a project.

### Tasks

#### Get All Tasks

```
GET /api/tasks
```

Returns a list of all tasks.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| status    | string | Filter by status (pending, completed) |
| priority  | string | Filter by priority (high, medium, low) |
| dueDate   | string | Filter by due date (today, tomorrow, this_week, overdue) |
| tag       | string | Filter by tag |
| limit     | number | Limit the number of results |
| offset    | number | Offset for pagination |

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Complete ML assignment",
      "description": "Finish the regression model for the course",
      "status": "pending",
      "priority": "high",
      "dueDate": "2023-03-10",
      "tags": ["course", "ML"],
      "subTasks": [
        {
          "id": 1,
          "title": "Data preprocessing",
          "isCompleted": true
        },
        ...
      ]
    },
    ...
  ],
  "count": 5,
  "total": 15
}
```

#### Get Task by ID

```
GET /api/tasks/:id
```

Returns details for a specific task.

#### Create Task

```
POST /api/tasks
```

Creates a new task.

**Request Body:**

```json
{
  "title": "Review deep learning paper",
  "description": "Read and take notes on the latest transformer architecture paper",
  "priority": "medium",
  "dueDate": "2023-03-15",
  "tags": ["research", "deep-learning"],
  "subTasks": [
    {
      "title": "Read introduction and methodology"
    },
    {
      "title": "Review results and discussion"
    }
  ]
}
```

#### Update Task

```
PUT /api/tasks/:id
```

Updates an existing task.

#### Delete Task

```
DELETE /api/tasks/:id
```

Deletes a task.

### Notes

#### Get All Notes

```
GET /api/notes
```

Returns a list of all notes.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| notebook  | string | Filter by notebook |
| tag       | string | Filter by tag |
| search    | string | Search in title and content |
| limit     | number | Limit the number of results |
| offset    | number | Offset for pagination |

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Neural Network Architectures",
      "content": "# Neural Network Types\n\n## Convolutional Neural Networks\n...",
      "notebook": "Deep Learning",
      "tags": ["neural-networks", "architecture", "deep-learning"],
      "createdAt": "2023-02-15T10:30:00Z",
      "updatedAt": "2023-02-16T14:20:00Z"
    },
    ...
  ],
  "count": 5,
  "total": 20
}
```

#### Get Note by ID

```
GET /api/notes/:id
```

Returns details for a specific note.

#### Create Note

```
POST /api/notes
```

Creates a new note.

**Request Body:**

```json
{
  "title": "Transformer Architecture",
  "content": "# Transformer Architecture\n\nThe transformer model introduced in 'Attention Is All You Need'...",
  "notebook": "Deep Learning",
  "tags": ["transformers", "attention", "nlp"]
}
```

#### Update Note

```
PUT /api/notes/:id
```

Updates an existing note.

#### Delete Note

```
DELETE /api/notes/:id
```

Deletes a note.

### Knowledge Management

#### Get All Concept Cards

```
GET /api/knowledge/concepts
```

Returns a list of all concept cards.

#### Get Concept Card by ID

```
GET /api/knowledge/concepts/:id
```

Returns details for a specific concept card.

#### Create Concept Card

```
POST /api/knowledge/concepts
```

Creates a new concept card.

**Request Body:**

```json
{
  "title": "Backpropagation",
  "description": "Algorithm for training neural networks by calculating gradients",
  "tags": ["neural-networks", "training", "gradients"],
  "status": "Draft",
  "relatedCourses": [1, 3],
  "relatedProjects": [2],
  "relatedJournals": []
}
```

#### Update Concept Card

```
PUT /api/knowledge/concepts/:id
```

Updates an existing concept card.

#### Delete Concept Card

```
DELETE /api/knowledge/concepts/:id
```

Deletes a concept card.

#### Get All Flashcard Decks

```
GET /api/knowledge/decks
```

Returns a list of all flashcard decks.

#### Get Flashcards by Deck ID

```
GET /api/knowledge/decks/:id/cards
```

Returns all flashcards in a specific deck.

#### Create Flashcard

```
POST /api/knowledge/flashcards
```

Creates a new flashcard.

**Request Body:**

```json
{
  "question": "What is backpropagation?",
  "answer": "An algorithm for training neural networks by calculating gradients and updating weights",
  "deckId": 1,
  "difficulty": "Medium"
}
```

### Journal

#### Get All Journal Entries

```
GET /api/journal
```

Returns a list of all journal entries.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string | Filter by start date |
| endDate   | string | Filter by end date |
| limit     | number | Limit the number of results |
| offset    | number | Offset for pagination |

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2023-03-01",
      "morningChecklist": {
        "wakeupRitual": true,
        "exercise": true,
        "breakfast": true,
        "hydration": true,
        "studyPlanned": true,
        "studySubject": "Machine Learning",
        "studyDuration": 120
      },
      "dailyPractices": {
        "readingMinutes": 45,
        "learningMinutes": 120,
        "journaling": true,
        "gratitudeLog": [
          "Learned a new concept in ML",
          "Had a productive study session",
          "Connected with a study partner"
        ]
      },
      "eveningChecklist": {
        "goalsReview": true,
        "meditation": true,
        "sleepPrep": true
      },
      "mood": 8,
      "energy": 7,
      "notes": "Productive day with good focus. Made progress on the ML project."
    },
    ...
  ],
  "count": 7,
  "total": 30
}
```

#### Get Journal Entry by ID

```
GET /api/journal/:id
```

Returns details for a specific journal entry.

#### Create Journal Entry

```
POST /api/journal
```

Creates a new journal entry.

**Request Body:**

```json
{
  "date": "2023-03-05",
  "morningChecklist": {
    "wakeupRitual": true,
    "exercise": false,
    "breakfast": true,
    "hydration": true,
    "studyPlanned": true,
    "studySubject": "Deep Learning",
    "studyDuration": 90
  },
  "dailyPractices": {
    "readingMinutes": 30,
    "learningMinutes": 90,
    "journaling": true,
    "gratitudeLog": [
      "Made progress on my project",
      "Had a good conversation with a mentor",
      "Found a helpful resource for my studies"
    ]
  },
  "eveningChecklist": {
    "goalsReview": true,
    "meditation": true,
    "sleepPrep": false
  },
  "mood": 7,
  "energy": 6,
  "notes": "Good day overall. Need to improve sleep routine."
}
```

#### Update Journal Entry

```
PUT /api/journal/:id
```

Updates an existing journal entry.

#### Delete Journal Entry

```
DELETE /api/journal/:id
```

Deletes a journal entry.

### Interview Preparation

#### Get All Questions

```
GET /api/interview/questions
```

Returns a list of all interview questions.

#### Get Question by ID

```
GET /api/interview/questions/:id
```

Returns details for a specific question.

#### Create Question

```
POST /api/interview/questions
```

Creates a new interview question.

**Request Body:**

```json
{
  "category": "Algorithms",
  "difficulty": "Medium",
  "question": "Explain how quicksort works and analyze its time complexity.",
  "answer": "Quicksort is a divide-and-conquer algorithm that works by selecting a 'pivot' element...",
  "notes": "Remember to mention worst-case scenarios and optimizations",
  "isReviewed": false
}
```

#### Get All Mock Interviews

```
GET /api/interview/mock-interviews
```

Returns a list of all scheduled mock interviews.

#### Create Mock Interview

```
POST /api/interview/mock-interviews
```

Schedules a new mock interview.

**Request Body:**

```json
{
  "title": "Algorithm and Data Structure Practice",
  "scheduledFor": "2023-03-20T14:00:00Z",
  "duration": 60,
  "topics": ["Sorting Algorithms", "Dynamic Programming", "Graph Traversal"],
  "notes": "Focus on time complexity analysis and edge cases",
  "isCompleted": false
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid parameters |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource not found |
| 409  | Conflict - Resource already exists |
| 500  | Internal Server Error |

## Rate Limiting

API requests are limited to 100 requests per minute per user. If you exceed this limit, you'll receive a 429 Too Many Requests response.

## Versioning

The current API version is v1. All endpoints should be prefixed with `/api/v1` for future-proofing, although the `/api` prefix will default to the current version.


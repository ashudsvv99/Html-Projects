# Database Schema - 360° Learning and Tracking Platform

This document outlines the database schema for the 360° Learning and Tracking Platform.

## Overview

The platform uses a relational database with the following main tables:

1. **Users** - User accounts and authentication
2. **Courses** - Learning courses and lessons
3. **Projects** - Learning projects and their details
4. **Tasks** - To-do items and subtasks
5. **Notes** - Notes and notebooks
6. **Journal Entries** - Daily journal entries and checklists
7. **Knowledge** - Concept cards, flashcards, and ideas
8. **Interview** - Interview questions, mock interviews, and resources

## Entity Relationship Diagram

```
┌─────────┐       ┌─────────┐       ┌─────────────┐
│  Users  │───┐   │ Courses │───────│   Lessons   │
└─────────┘   │   └─────────┘       └─────────────┘
              │   ┌─────────┐       ┌─────────────┐
              ├───│Projects │───────│ ProjectTags │
              │   └─────────┘       └─────────────┘
              │   ┌─────────┐       ┌─────────────┐
              ├───│  Tasks  │───────│  SubTasks   │
              │   └─────────┘       └─────────────┘
              │   ┌─────────┐       ┌─────────────┐
              ├───│  Notes  │───────│ NoteTags    │
              │   └─────────┘       └─────────────┘
              │   ┌──────────────┐  ┌─────────────┐
              ├───│JournalEntries│──│Checklists   │
              │   └──────────────┘  └─────────────┘
              │   ┌─────────┐       ┌─────────────┐
              ├───│ConceptCards│────│ Flashcards  │
              │   └─────────┘       └─────────────┘
              │   ┌─────────┐       ┌─────────────┐
              └───│Interview│───────│MockInterviews│
                  └─────────┘       └─────────────┘
```

## Detailed Schema

### Users Table

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Username for login |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| first_name | VARCHAR(50) | | First name |
| last_name | VARCHAR(50) | | Last name |
| avatar_url | VARCHAR(255) | | Profile picture URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Courses Table

Stores information about learning courses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| title | VARCHAR(100) | NOT NULL | Course title |
| description | TEXT | | Course description |
| category | VARCHAR(50) | | Course category |
| total_lessons | INTEGER | DEFAULT 0 | Total number of lessons |
| completed_lessons | INTEGER | DEFAULT 0 | Number of completed lessons |
| start_date | DATE | | Course start date |
| expected_end_date | DATE | | Expected completion date |
| status | VARCHAR(20) | DEFAULT 'active' | Course status (active, completed, paused) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Lessons Table

Stores information about individual lessons within courses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| course_id | INTEGER | FOREIGN KEY | Reference to Courses table |
| title | VARCHAR(100) | NOT NULL | Lesson title |
| description | TEXT | | Lesson description |
| order_index | INTEGER | NOT NULL | Order within the course |
| is_completed | BOOLEAN | DEFAULT FALSE | Completion status |
| completed_date | TIMESTAMP | | Completion timestamp |
| notes | TEXT | | User notes for the lesson |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Projects Table

Stores information about learning projects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| title | VARCHAR(100) | NOT NULL | Project title |
| description | TEXT | | Project description |
| status | VARCHAR(20) | DEFAULT 'not_started' | Status (not_started, in_progress, completed) |
| priority | VARCHAR(20) | DEFAULT 'medium' | Priority (high, medium, low) |
| progress | INTEGER | DEFAULT 0 | Progress percentage (0-100) |
| start_date | DATE | | Project start date |
| completion_date | DATE | | Actual completion date |
| category | VARCHAR(50) | | Project category |
| tech_stack | JSON | | Technologies used (array) |
| github_url | VARCHAR(255) | | GitHub repository URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### ProjectTags Table

Links projects to tags for categorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| project_id | INTEGER | FOREIGN KEY | Reference to Projects table |
| tag | VARCHAR(50) | NOT NULL | Tag name |

### Tasks Table

Stores to-do items and tasks.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| title | VARCHAR(100) | NOT NULL | Task title |
| description | TEXT | | Task description |
| status | VARCHAR(20) | DEFAULT 'pending' | Status (pending, completed) |
| priority | VARCHAR(20) | DEFAULT 'medium' | Priority (high, medium, low) |
| due_date | TIMESTAMP | | Due date and time |
| completed_date | TIMESTAMP | | Completion timestamp |
| list_name | VARCHAR(50) | DEFAULT 'inbox' | List name (inbox, today, this_week, later) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### TaskTags Table

Links tasks to tags for categorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| task_id | INTEGER | FOREIGN KEY | Reference to Tasks table |
| tag | VARCHAR(50) | NOT NULL | Tag name |

### SubTasks Table

Stores subtasks for main tasks.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| task_id | INTEGER | FOREIGN KEY | Reference to Tasks table |
| title | VARCHAR(100) | NOT NULL | Subtask title |
| is_completed | BOOLEAN | DEFAULT FALSE | Completion status |
| completed_date | TIMESTAMP | | Completion timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Notes Table

Stores notes and documentation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| title | VARCHAR(100) | NOT NULL | Note title |
| content | TEXT | | Note content (markdown) |
| notebook | VARCHAR(50) | | Notebook name |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### NoteTags Table

Links notes to tags for categorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| note_id | INTEGER | FOREIGN KEY | Reference to Notes table |
| tag | VARCHAR(50) | NOT NULL | Tag name |

### JournalEntries Table

Stores daily journal entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| date | DATE | NOT NULL | Journal entry date |
| morning_checklist | JSON | NOT NULL | Morning checklist items |
| daily_practices | JSON | NOT NULL | Daily practice records |
| evening_checklist | JSON | NOT NULL | Evening checklist items |
| mood | INTEGER | NOT NULL | Mood rating (1-10) |
| energy | INTEGER | NOT NULL | Energy rating (1-10) |
| notes | TEXT | | Free-form notes and reflections |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### ConceptCards Table

Stores knowledge concept cards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| title | VARCHAR(100) | NOT NULL | Concept title |
| description | TEXT | | Concept description |
| tags | JSON | NOT NULL | Tags array |
| status | VARCHAR(20) | DEFAULT 'Draft' | Status (Draft, Reviewed, Riveted) |
| related_courses | JSON | NOT NULL | Related course IDs |
| related_projects | JSON | NOT NULL | Related project IDs |
| related_journals | JSON | NOT NULL | Related journal entry IDs |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### FlashcardDecks Table

Stores flashcard decks.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| name | VARCHAR(100) | NOT NULL | Deck name |
| description | TEXT | | Deck description |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Flashcards Table

Stores individual flashcards.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| deck_id | INTEGER | FOREIGN KEY | Reference to FlashcardDecks table |
| question | TEXT | NOT NULL | Question side |
| answer | TEXT | NOT NULL | Answer side |
| difficulty | VARCHAR(20) | DEFAULT 'Medium' | Difficulty (Easy, Medium, Hard) |
| last_reviewed | TIMESTAMP | | Last review timestamp |
| next_review | TIMESTAMP | | Next scheduled review |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### Ideas Table

Stores idea incubator entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| content | TEXT | NOT NULL | Idea content |
| category | VARCHAR(50) | NOT NULL | Category (Future Project, Research Idea, etc.) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### InterviewQuestions Table

Stores interview practice questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| category | VARCHAR(50) | NOT NULL | Category (Algorithms, Data Structures, etc.) |
| difficulty | VARCHAR(20) | DEFAULT 'Medium' | Difficulty (Easy, Medium, Hard) |
| question | TEXT | NOT NULL | Question text |
| answer | TEXT | NOT NULL | Answer/solution |
| notes | TEXT | | Additional notes |
| is_reviewed | BOOLEAN | DEFAULT FALSE | Review status |
| last_reviewed | TIMESTAMP | | Last review timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### MockInterviews Table

Stores mock interview sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| title | VARCHAR(100) | NOT NULL | Interview title |
| scheduled_for | TIMESTAMP | NOT NULL | Scheduled date and time |
| duration | INTEGER | DEFAULT 60 | Duration in minutes |
| topics | JSON | NOT NULL | Topics array |
| notes | TEXT | | Preparation notes |
| is_completed | BOOLEAN | DEFAULT FALSE | Completion status |
| feedback | TEXT | | Post-interview feedback |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### InterviewResources Table

Stores interview preparation resources.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY | Reference to Users table |
| title | VARCHAR(100) | NOT NULL | Resource title |
| type | VARCHAR(20) | NOT NULL | Type (PDF, Link, Note) |
| content | TEXT | NOT NULL | Resource content or URL |
| category | VARCHAR(50) | NOT NULL | Category (Algorithms, Data Structures, etc.) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

## JSON Structures

### Morning Checklist JSON Structure

```json
{
  "wakeupRitual": boolean,
  "exercise": boolean,
  "breakfast": boolean,
  "hydration": boolean,
  "studyPlanned": boolean,
  "studySubject": string,
  "studyDuration": number
}
```

### Daily Practices JSON Structure

```json
{
  "readingMinutes": number,
  "learningMinutes": number,
  "journaling": boolean,
  "gratitudeLog": string[]
}
```

### Evening Checklist JSON Structure

```json
{
  "goalsReview": boolean,
  "meditation": boolean,
  "sleepPrep": boolean
}
```

## Indexes

The following indexes are recommended for performance optimization:

| Table | Column(s) | Index Type | Purpose |
|-------|-----------|------------|---------|
| Users | email | UNIQUE | Fast user lookup by email |
| Courses | user_id, status | BTREE | Filter courses by user and status |
| Projects | user_id, status | BTREE | Filter projects by user and status |
| Tasks | user_id, status, due_date | BTREE | Filter tasks by user, status, and due date |
| JournalEntries | user_id, date | BTREE | Filter journal entries by user and date |
| Flashcards | deck_id, next_review | BTREE | Retrieve cards due for review |
| InterviewQuestions | user_id, category, is_reviewed | BTREE | Filter questions by user, category, and review status |

## Database Migrations

Database migrations are managed using Knex.js. Migration files are located in the `server/src/db/migrations` directory.

To run migrations:

```bash
cd server
npm run migrate
```

To rollback migrations:

```bash
cd server
npx knex migrate:rollback
```

## Data Relationships

- **One-to-Many Relationships**:
  - User → Courses
  - User → Projects
  - User → Tasks
  - User → Notes
  - User → JournalEntries
  - User → ConceptCards
  - User → FlashcardDecks
  - Course → Lessons
  - Task → SubTasks
  - FlashcardDeck → Flashcards

- **Many-to-Many Relationships**:
  - Projects ↔ Tags (via ProjectTags)
  - Tasks ↔ Tags (via TaskTags)
  - Notes ↔ Tags (via NoteTags)

## Data Integrity

The following constraints ensure data integrity:

- Foreign key constraints between related tables
- NOT NULL constraints on required fields
- UNIQUE constraints on fields that must be unique
- DEFAULT values for fields with standard initial values
- Cascading deletes for dependent records


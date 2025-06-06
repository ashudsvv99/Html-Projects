# 360° Learning and Tracking Platform

A comprehensive personal learning and tracking platform that helps you manage your educational journey, projects, tasks, and lifestyle habits in one place.

## Features

### Dashboard
- Quick-stats cards (Total Courses, Active Projects, XP/Streaks, Pending Todos)
- Today's Snapshot (Upcoming tasks, Journal highlights, Habit summary)
- Progress tracking (Course progress, Project status, Lifestyle metrics)

### Learning
- **Courses**: Track your progress in various courses
- **Projects**: Manage your learning projects with detailed tracking
- **Interview Preparation**: Prepare for interviews with question banks, mock interviews, and resources

### Organization
- **Tasks**: Manage your to-do lists with priorities and deadlines
- **Notes**: Take and organize notes with rich text support

### Lifestyle Monitoring
- **Knowledge Management**:
  - Knowledge Vault: Store and organize concept cards
  - Flashcards: Create and review flashcards with spaced repetition
  - Idea Incubator: Capture and categorize ideas
- **Journal**: Track daily activities, habits, mood, and reflections

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API requests
- React Big Calendar for calendar views
- React Markdown for rich text rendering

### Backend
- Node.js with Express
- Knex.js for database queries and migrations
- SQLite for development, PostgreSQL for production
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/learning-platform.git
cd learning-platform
```

2. Install dependencies for both client and server
```
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up the database
```
# Run migrations
npm run migrate

# (Optional) Run seeds for sample data
npm run seed
```

4. Start the development servers
```
# Start the backend server (from the server directory)
npm run dev

# Start the frontend server (from the client directory)
cd ../client
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
learning-platform/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main application component
│   │   └── index.tsx       # Entry point
│   └── package.json        # Frontend dependencies
│
├── server/                 # Backend Node.js application
│   ├── src/                # Source files
│   │   ├── db/             # Database related files
│   │   │   ├── migrations/ # Database migrations
│   │   │   └── seeds/      # Database seeds
│   │   ├── routes/         # API routes
│   │   └── index.js        # Entry point
│   └── package.json        # Backend dependencies
│
└── README.md               # Project documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

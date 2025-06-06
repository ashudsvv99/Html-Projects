# 360° Learning and Tracking Platform

A comprehensive personal learning management system designed to track your educational journey, projects, tasks, and lifestyle habits in one integrated platform.

![Learning Platform Dashboard](https://via.placeholder.com/1200x600?text=360+Learning+Platform)

## 🌟 Features

### 📊 Dashboard
- **Quick-stats cards**: Track your total courses, active projects, XP/streaks, and pending todos
- **Today's Snapshot**: View upcoming tasks, journal highlights, and habit summary
- **Progress Tracking**: Monitor course progress and project status

### 🎓 Learning
- **Courses**: Manage and track progress in various courses
- **Projects**: Organize learning projects with detailed tracking
- **Interview Preparation**: Practice with question banks and mock interviews

### 📝 Organization
- **Tasks**: Manage to-do lists with priorities, due dates, and tags
- **Notes**: Create and organize rich text/markdown notes

### 🔱 Lifestyle Monitoring
- **Knowledge Management**: Build your second brain with concept cards and flashcards
- **Daily Journal**: Track daily habits, mood, and reflections

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn
- PostgreSQL (recommended for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/learning-platform.git
   cd learning-platform
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In the server directory
   cp .env.example .env
   # Edit .env with your database credentials

   # In the client directory
   cp .env.example .env
   ```

4. **Set up the database**
   ```bash
   # In the server directory
   npm run migrate
   ```

5. **Start the development servers**
   ```bash
   # Start the server (from server directory)
   npm run dev

   # Start the client (from client directory)
   npm start
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
learning-platform/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── App.tsx         # Main application component
│
├── server/                 # Backend Node.js/Express application
│   ├── src/
│   │   ├── db/             # Database setup and migrations
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry point
│   └── knexfile.js         # Knex configuration
│
└── README.md               # Project documentation
```

## 📚 Documentation

- [User Guide](./docs/USER_GUIDE.md) - How to use the platform
- [API Documentation](./docs/API_DOCS.md) - API endpoints and usage
- [Development Guide](./docs/DEVELOPMENT.md) - Guide for developers
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Database structure

## 🧩 Core Modules

### Dashboard Module
The dashboard provides an overview of your learning journey with quick-stats cards, progress indicators, and upcoming tasks.

### Learning Module
Manage your educational content, track course progress, and organize learning projects. Includes an interview preparation system with question banks and mock interview scheduling.

### Organization Module
Keep track of tasks and notes in a structured manner. Tasks can be organized with priorities, due dates, and tags, while notes support rich text and markdown.

### Lifestyle Monitoring Module
Build your second brain with knowledge management tools and track daily habits with the journal system.

## 🔧 Technologies Used

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios

### Backend
- Node.js
- Express
- Knex.js
- PostgreSQL
- TypeScript

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements
- [Material-UI](https://mui.com/) for the UI components
- [React Big Calendar](https://github.com/jquense/react-big-calendar) for the calendar views
- [React Markdown](https://github.com/remarkjs/react-markdown) for markdown rendering


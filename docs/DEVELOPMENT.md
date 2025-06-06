# Development Guide - 360° Learning and Tracking Platform

This guide provides information for developers who want to contribute to or extend the 360° Learning and Tracking Platform.

## Table of Contents
- [Development Environment Setup](#development-environment-setup)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Database Migrations](#database-migrations)
- [Adding New Features](#adding-new-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn
- PostgreSQL (recommended) or SQLite for development
- Git

### Setup Steps

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
   # Edit .env with your database credentials and other settings
   ```

4. **Set up the database**
   ```bash
   # In the server directory
   npm run migrate
   
   # Optional: Seed the database with sample data
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   # Start the server in development mode (from server directory)
   npm run dev

   # Start the client in development mode (from client directory)
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Development Tools

We recommend the following tools for development:
- Visual Studio Code with the following extensions:
  - ESLint
  - Prettier
  - TypeScript
  - React Developer Tools
- Postman or Insomnia for API testing
- pgAdmin or DBeaver for database management

## Project Architecture

### Overview

The 360° Learning and Tracking Platform follows a client-server architecture:
- **Frontend**: React single-page application with TypeScript
- **Backend**: Node.js/Express API server with TypeScript
- **Database**: PostgreSQL with Knex.js as the query builder

### Directory Structure

```
learning-platform/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable UI components
│       │   ├── common/     # Shared components (buttons, cards, etc.)
│       │   ├── Layout/     # Layout components (header, sidebar, etc.)
│       │   └── [feature]/  # Feature-specific components
│       ├── pages/          # Page components for each route
│       ├── services/       # API service clients
│       ├── utils/          # Utility functions
│       ├── hooks/          # Custom React hooks
│       ├── context/        # React context providers
│       ├── types/          # TypeScript type definitions
│       ├── assets/         # Images, icons, etc.
│       ├── styles/         # Global styles
│       ├── App.tsx         # Main application component
│       └── index.tsx       # Application entry point
│
├── server/                 # Backend Node.js/Express application
│   ├── src/
│   │   ├── db/             # Database setup and migrations
│   │   │   ├── migrations/ # Database migration files
│   │   │   └── seeds/      # Seed data
│   │   ├── routes/         # API route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Data models
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Server entry point
│   ├── knexfile.js         # Knex configuration
│   └── tsconfig.json       # TypeScript configuration
│
├── docs/                   # Documentation
└── README.md               # Project overview
```

### Data Flow

1. **Client-side**:
   - React components render the UI
   - User interactions trigger state changes or API calls
   - API service modules handle communication with the backend
   - Context providers manage global state

2. **Server-side**:
   - Express routes receive API requests
   - Controllers process the requests and apply business logic
   - Models interact with the database
   - Responses are sent back to the client

## Coding Standards

### General Guidelines

- Use TypeScript for type safety
- Follow the DRY (Don't Repeat Yourself) principle
- Write self-documenting code with clear variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single responsibility

### Frontend Guidelines

- Use functional components with hooks
- Organize components by feature
- Use TypeScript interfaces for props and state
- Use CSS-in-JS with Material-UI's styling system
- Implement responsive design for all components

### Backend Guidelines

- Use TypeScript for all server code
- Implement proper error handling
- Validate all input data
- Use async/await for asynchronous operations
- Follow RESTful API design principles

### Code Formatting

We use ESLint and Prettier to enforce consistent code style:

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

## Testing

### Frontend Testing

We use Jest and React Testing Library for frontend tests:

```bash
# Run all tests
cd client
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Backend Testing

We use Jest and Supertest for backend tests:

```bash
# Run all tests
cd server
npm test

# Run tests with coverage
npm test -- --coverage
```

### End-to-End Testing

We use Cypress for end-to-end testing:

```bash
# Open Cypress test runner
cd client
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

## Database Migrations

We use Knex.js for database migrations:

```bash
# Create a new migration
cd server
npx knex migrate:make migration_name

# Run all pending migrations
npm run migrate

# Rollback the last migration
npx knex migrate:rollback

# Rollback all migrations
npx knex migrate:rollback --all
```

### Migration File Structure

```javascript
exports.up = function(knex) {
  return knex.schema.createTable('table_name', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('table_name');
};
```

## Adding New Features

### Frontend Features

1. **Plan your feature**:
   - Define the UI components needed
   - Identify required API endpoints
   - Determine state management needs

2. **Create components**:
   - Add new components in the appropriate directory
   - Implement the UI using Material-UI components
   - Add proper TypeScript types

3. **Add API services**:
   - Create or update service functions in `src/services/`
   - Implement error handling

4. **Update routing**:
   - Add new routes in `App.tsx` if needed

5. **Test your feature**:
   - Write unit tests for components
   - Test the feature manually

### Backend Features

1. **Plan your feature**:
   - Define the API endpoints needed
   - Design the database schema changes
   - Identify business logic requirements

2. **Create database migrations**:
   - Add new tables or modify existing ones

3. **Implement API endpoints**:
   - Add routes in the appropriate route file
   - Create controller functions
   - Implement data validation

4. **Test your feature**:
   - Write unit tests for the API endpoints
   - Test manually with Postman or similar tools

## Deployment

### Production Build

```bash
# Build the client
cd client
npm run build

# Build the server
cd ../server
npm run build
```

### Deployment Options

1. **Traditional Hosting**:
   - Deploy the built client files to a static file server
   - Deploy the server to a Node.js hosting service

2. **Docker Deployment**:
   - Use the provided Dockerfile and docker-compose.yml
   - Build and run the containers

   ```bash
   docker-compose up -d
   ```

3. **Cloud Deployment**:
   - Deploy the frontend to services like Netlify, Vercel, or AWS S3
   - Deploy the backend to services like Heroku, AWS Elastic Beanstalk, or Google App Engine

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

```
NODE_ENV=production
DATABASE_URL=your_production_db_url
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Troubleshooting

### Common Issues

#### Frontend Issues

1. **"Module not found" errors**:
   - Check import paths
   - Ensure the module is installed
   - Restart the development server

2. **TypeScript errors**:
   - Check type definitions
   - Update interfaces as needed
   - Ensure proper typing for all variables and functions

#### Backend Issues

1. **Database connection errors**:
   - Check database credentials in .env
   - Ensure the database server is running
   - Verify network connectivity

2. **API endpoint not found**:
   - Check route definitions
   - Verify the endpoint URL
   - Check for typos in the route path

#### Development Environment Issues

1. **Node.js version conflicts**:
   - Use nvm to manage Node.js versions
   - Ensure you're using the correct version as specified in .nvmrc

2. **Package installation issues**:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Debugging

1. **Frontend debugging**:
   - Use React Developer Tools browser extension
   - Use console.log() for quick debugging
   - Set breakpoints in browser developer tools

2. **Backend debugging**:
   - Use console.log() for quick debugging
   - Use the debugger with VS Code
   - Check server logs

### Getting Help

If you're stuck on an issue:
1. Check the existing documentation
2. Search for similar issues in the project repository
3. Ask for help in the project's communication channels
4. Create a detailed issue in the repository with steps to reproduce


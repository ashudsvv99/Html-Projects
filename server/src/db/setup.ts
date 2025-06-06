import knex from 'knex';
import path from 'path';
import fs from 'fs';

// Get the knexfile configuration
const environment = process.env.NODE_ENV || 'development';
const config = require('../../knexfile')[environment];

// Initialize knex
const db = knex(config);

// Run migrations if they haven't been run yet
const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully.');
    
    // Check if we need to run seeds
    const shouldSeed = process.env.SEED_DB === 'true';
    if (shouldSeed) {
      console.log('Running database seeds...');
      await db.seed.run();
      console.log('Seeds completed successfully.');
    }
  } catch (error) {
    console.error('Error running migrations or seeds:', error);
    process.exit(1);
  }
};

// Create database tables if they don't exist
const setupDatabase = async () => {
  try {
    // Check if migrations directory exists
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('Creating migrations directory...');
      fs.mkdirSync(migrationsDir, { recursive: true });
    }
    
    // Run migrations
    await runMigrations();
    
    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
};

export { db, setupDatabase };


const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Endpoint to run migrations up
app.post('/migrations/up', (req, res) => {
  const migrationName = req.body.name;
  
  if (!migrationName) {
    return res.status(400).json({ error: 'Migration name is required' });
  }
  
  exec(`npx knex migrate:up ${migrationName}`, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration up error: ${error.message}`);
      return res.status(500).json({ error: error.message, stderr });
    }
    
    res.status(200).json({ message: 'Migration up successful', output: stdout });
  });
});

// Endpoint to run migrations down
app.post('/migrations/down', (req, res) => {
  const migrationName = req.body.name;
  
  if (!migrationName) {
    return res.status(400).json({ error: 'Migration name is required' });
  }
  
  exec(`npx knex migrate:down ${migrationName}`, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration down error: ${error.message}`);
      return res.status(500).json({ error: error.message, stderr });
    }
    
    res.status(200).json({ message: 'Migration down successful', output: stdout });
  });
});

// Endpoint to run all migrations
app.post('/migrations/latest', (req, res) => {
  exec('npx knex migrate:latest', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration latest error: ${error.message}`);
      return res.status(500).json({ error: error.message, stderr });
    }
    
    res.status(200).json({ message: 'All migrations run successfully', output: stdout });
  });
});

// Endpoint to rollback all migrations
app.post('/migrations/rollback', (req, res) => {
  exec('npx knex migrate:rollback', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration rollback error: ${error.message}`);
      return res.status(500).json({ error: error.message, stderr });
    }
    
    res.status(200).json({ message: 'Migrations rolled back successfully', output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Migration server running on port ${PORT}`);
}); 
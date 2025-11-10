import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Admin password - in production, use environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// API endpoint to get config
app.get('/api/config', (req, res) => {
  try {
    const configPath = join(__dirname, 'dist', 'config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config' });
  }
});

// API endpoint to update config (protected)
app.post('/api/config', (req, res) => {
  const { password, config } = req.body;

  // Simple password authentication
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const configPath = join(__dirname, 'dist', 'config.json');
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    res.json({ success: true, message: 'Config updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write config' });
  }
});

// API endpoint to verify password
app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false, error: 'Invalid password' });
  }
});

// Serve index.html for all other routes (SPA support)
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin password is: ${ADMIN_PASSWORD}`);
});

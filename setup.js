#!/usr/bin/env node

/**
 * Setup script to install dependencies
 * Usage: node setup.js
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Setting up the exhibitor scraper...');

// Check if Python is available
const pythonCheck = spawn('python3', ['--version']);

pythonCheck.on('error', (err) => {
  console.error('Python 3 is not installed or not in your PATH. Please install Python 3 and try again.');
  console.error('Download from: https://www.python.org/downloads/');
  process.exit(1);
});

pythonCheck.on('close', (code) => {
  if (code !== 0) {
    console.error('Failed to check Python version. Please ensure Python 3 is installed.');
    process.exit(1);
  }
  
  console.log('Installing Python dependencies...');
  
  // Install Python dependencies
  const pip = spawn('pip3', ['install', 'requests', 'beautifulsoup4']);
  
  pip.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  pip.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  pip.on('close', (code) => {
    if (code !== 0) {
      console.error('Failed to install Python dependencies.');
      console.error('Try running manually: pip3 install requests beautifulsoup4');
      process.exit(1);
    }
    
    console.log('Python dependencies installed successfully!');
    console.log('Setup complete! You can now run:');
    console.log('  npm run dev:all - Start the development server and API server');
    console.log('  npm run scrape - Run the scraper from the command line');
  });
}); 
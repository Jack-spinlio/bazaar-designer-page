import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const execPromise = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API endpoint to trigger scraping
app.post('/api/scrape-exhibitors', async (req, res) => {
  try {
    const { site = 'taipeicycle' } = req.body;
    
    // Path to the Python scraper
    const scraperPath = path.join(__dirname, '..', 'scripts', 'exhibitor_scraper.py');
    
    // Use the virtual environment Python interpreter
    const pythonCmd = `source ${path.join(__dirname, '..', '.venv/bin/activate')} && python3`;
    console.log(`Executing scraper: ${pythonCmd} ${scraperPath} --site ${site}`);
    
    // Execute the scraper with the site parameter using shell for source activation
    const fullCommand = `${pythonCmd} ${scraperPath} --site ${site}`;
    const { stdout, stderr } = await execPromise(fullCommand, { shell: true });
    
    if (stderr && !stderr.includes('WARNING')) {
      console.error('Scraper error:', stderr);
      return res.status(500).json({ success: false, message: 'Error executing scraper' });
    }
    
    // Parse the result to get the count of exhibitors
    let exhibitorCount = 0;
    try {
      const match = stdout.match(/Successfully scraped (\d+) exhibitors/);
      if (match && match[1]) {
        exhibitorCount = parseInt(match[1], 10);
      }
    } catch (error) {
      console.warn('Could not parse exhibitor count:', error);
    }
    
    // Run the import command to ensure data is in Supabase
    // This uses the existing import functionality in the scrape-exhibitors.js script
    const importPath = path.join(__dirname, '..', 'scripts', 'scrape-exhibitors.js');
    try {
      await execPromise(`node ${importPath} --import`, { shell: true });
      console.log('Import completed successfully');
    } catch (importError) {
      console.error('Import error:', importError);
      // Continue even if import fails, as the scrape was successful
    }
    
    return res.status(200).json({
      success: true,
      message: 'Scraping completed successfully',
      count: exhibitorCount,
      details: stdout
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while scraping',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
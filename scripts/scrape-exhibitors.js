#!/usr/bin/env node

/**
 * Command-line script to run the exhibitor scraper
 * Usage: node scripts/scrape-exhibitors.js --url <url> or --start <num> --end <num>
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
let options = {
  startPage: 1,
  endPage: 3,
  sleepTime: 1,
  outputFile: `exhibitors-${Date.now()}`,
  format: 'json',
  singleUrl: null,
  import: false,
  site: 'taipeicycle' // Default to Taipei Cycle website
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--url' && args[i + 1]) {
    options.singleUrl = args[i + 1];
    i++;
  } else if (arg === '--start' && args[i + 1]) {
    options.startPage = parseInt(args[i + 1], 10);
    i++;
  } else if (arg === '--end' && args[i + 1]) {
    options.endPage = parseInt(args[i + 1], 10);
    i++;
  } else if (arg === '--sleep' && args[i + 1]) {
    options.sleepTime = parseFloat(args[i + 1]);
    i++;
  } else if (arg === '--output' && args[i + 1]) {
    options.outputFile = args[i + 1];
    i++;
  } else if (arg === '--format' && args[i + 1]) {
    options.format = args[i + 1];
    i++;
  } else if (arg === '--import') {
    options.import = true;
  } else if (arg === '--site' && args[i + 1]) {
    options.site = args[i + 1];
    i++;
  } else if (arg === '--help') {
    console.log(`
Usage: node scripts/scrape-exhibitors.js [options]

Options:
  --url <url>           Scrape a single exhibitor URL
  --start <num>         Start page number (default: 1)
  --end <num>           End page number (default: 3)
  --sleep <num>         Sleep time between requests in seconds (default: 1)
  --output <filename>   Output filename without extension (default: exhibitors-timestamp)
  --format <format>     Output format: json, csv, or both (default: json)
  --import              Import the data to Supabase after scraping
  --site <site>         Website to scrape (default: taipeicycle)
  --help                Show this help message
    `);
    process.exit(0);
  }
}

// Ensure output directory exists
const outputDir = path.resolve(process.cwd(), 'tmp');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, `${options.outputFile}.${options.format}`);
const scraperPath = path.resolve(process.cwd(), 'scripts/exhibitor_scraper.py');

// Build the command - use the virtual environment Python
let cmd = 'python3';
// If we have a virtual environment set up
if (fs.existsSync(path.resolve(process.cwd(), '.venv'))) {
  // On macOS/Linux, we can source the activate script
  if (process.platform !== 'win32') {
    cmd = `source ${path.resolve(process.cwd(), '.venv/bin/activate')} && python3`;
  } else {
    // On Windows, we would use a different approach
    cmd = `${path.resolve(process.cwd(), '.venv/Scripts/python.exe')}`;
  }
}

let cmdArgs = [
  scraperPath,
  '--output', options.outputFile,
  '--format', options.format
];

if (options.singleUrl) {
  cmdArgs.push('--url', options.singleUrl);
} else {
  cmdArgs.push(
    '--start', options.startPage.toString(),
    '--end', options.endPage.toString(),
    '--sleep', options.sleepTime.toString()
  );
}

console.log(`Running ${options.site} scraper with command:`, cmd, cmdArgs.join(' '));

// Run the scraper
let scraperProcess;
if (cmd.includes('source')) {
  // For shell commands that include source, we need to use shell: true
  const fullCommand = `${cmd} ${cmdArgs.join(' ')}`;
  scraperProcess = spawn(fullCommand, [], {
    cwd: outputDir,
    stdio: 'inherit',
    shell: true
  });
} else {
  // Normal execution for direct commands
  scraperProcess = spawn(cmd, cmdArgs, {
    cwd: outputDir,
    stdio: 'inherit'
  });
}

scraperProcess.on('close', (code) => {
  console.log(`Scraper process exited with code ${code}`);
  
  if (code === 0 && options.import) {
    console.log('Importing data to Supabase...');
    importToSupabase(outputPath, options.site);
  }
});

async function importToSupabase(filePath, site = 'taipeicycle') {
  try {
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.SUPABASE_URL || 'https://dnauvvkfpmtquaysfdvm.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuYXV2dmtmcG10cXVheXNmZHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNDM3ODMsImV4cCI6MjA1NjcxOTc4M30.8SOHVw4a6ht6AGycVYw4MjbBpNFXi7Rc3wvUJ717ZZM';
    
    // Read the JSON file
    const rawData = fs.readFileSync(filePath, 'utf8');
    const exhibitors = JSON.parse(rawData);
    
    console.log(`Found ${exhibitors.length} exhibitors to import`);
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, make sure the database tables exist
    await createTablesIfNotExist(supabase);
    
    let importedCount = 0;
    
    // Process each exhibitor
    for (const exhibitor of exhibitors) {
      try {
        // Check if exhibitor already exists
        const { data: existingExhibitors } = await supabase
          .from('exhibitors')
          .select('id')
          .eq('slug', exhibitor.slug)
          .limit(1);
        
        if (existingExhibitors && existingExhibitors.length > 0) {
          // Update existing
          const { error } = await supabase
            .from('exhibitors')
            .update({
              name: exhibitor.exhibitor_name,
              booth_info: exhibitor.booth_info,
              address: exhibitor.address,
              telephone: exhibitor.telephone,
              fax: exhibitor.fax,
              website: exhibitor.website,
              email: exhibitor.email,
              products: exhibitor.products,
              description: exhibitor.description,
              thumbnail_url: exhibitor.thumbnail_url,
              source_url: exhibitor.source_url,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingExhibitors[0].id);
          
          if (error) throw error;
          
          // Delete existing gallery images
          await supabase
            .from('exhibitor_gallery')
            .delete()
            .eq('exhibitor_id', existingExhibitors[0].id);
          
          // Insert new gallery images
          if (exhibitor.gallery_images && exhibitor.gallery_images.length > 0) {
            const galleryEntries = exhibitor.gallery_images.map((url, index) => ({
              exhibitor_id: existingExhibitors[0].id,
              image_url: url,
              display_order: index,
              created_at: new Date().toISOString()
            }));
            
            const { error: galleryError } = await supabase
              .from('exhibitor_gallery')
              .insert(galleryEntries);
            
            if (galleryError) throw galleryError;
          }
          
          console.log(`Updated exhibitor: ${exhibitor.exhibitor_name}`);
          importedCount++;
        } else {
          // Insert new
          const { data, error } = await supabase
            .from('exhibitors')
            .insert({
              name: exhibitor.exhibitor_name,
              slug: exhibitor.slug,
              booth_info: exhibitor.booth_info,
              address: exhibitor.address || null,
              telephone: exhibitor.telephone || null,
              fax: exhibitor.fax || null,
              website: exhibitor.website || null,
              email: exhibitor.email || null,
              products: exhibitor.products || null,
              description: exhibitor.description || null,
              thumbnail_url: exhibitor.thumbnail_url || null,
              source_url: exhibitor.source_url,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              claimed: false
            })
            .select('id')
            .single();
          
          if (error) throw error;
          
          // Insert gallery images
          if (data && exhibitor.gallery_images && exhibitor.gallery_images.length > 0) {
            const galleryEntries = exhibitor.gallery_images.map((url, index) => ({
              exhibitor_id: data.id,
              image_url: url,
              display_order: index,
              created_at: new Date().toISOString()
            }));
            
            const { error: galleryError } = await supabase
              .from('exhibitor_gallery')
              .insert(galleryEntries);
            
            if (galleryError) throw galleryError;
          }
          
          console.log(`Inserted exhibitor: ${exhibitor.exhibitor_name}`);
          importedCount++;
        }
      } catch (error) {
        console.error(`Error importing exhibitor ${exhibitor.exhibitor_name}:`, error);
      }
    }
    
    console.log(`Successfully imported ${importedCount} out of ${exhibitors.length} exhibitors`);
  } catch (error) {
    console.error('Error importing data to Supabase:', error);
  }
}

// Function to create the required tables in Supabase
async function createTablesIfNotExist(supabase) {
  try {
    // Check if the exhibitors table exists
    const { error } = await supabase
      .from('exhibitors')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Creating database tables...');
      
      try {
        // Try creating through direct SQL
        const tables = [
          // Exhibitors table
          `
          CREATE TABLE IF NOT EXISTS "exhibitors" (
            "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            "name" TEXT NOT NULL,
            "slug" TEXT NOT NULL UNIQUE,
            "booth_info" TEXT,
            "address" TEXT,
            "telephone" TEXT,
            "fax" TEXT, 
            "website" TEXT,
            "email" TEXT,
            "products" TEXT,
            "description" TEXT,
            "thumbnail_url" TEXT,
            "source_url" TEXT,
            "claimed" BOOLEAN DEFAULT FALSE,
            "user_id" UUID,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
          `,
          
          // Gallery table
          `
          CREATE TABLE IF NOT EXISTS "exhibitor_gallery" (
            "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            "exhibitor_id" UUID NOT NULL,
            "image_url" TEXT NOT NULL,
            "display_order" INTEGER DEFAULT 0,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
            CONSTRAINT "exhibitor_gallery_exhibitor_id_fkey" FOREIGN KEY ("exhibitor_id") REFERENCES "exhibitors"("id") ON DELETE CASCADE
          );
          `
        ];
        
        // Execute each query through the REST API
        for (const sql of tables) {
          await supabase.rpc('exec_sql', { sql });
        }
        
        console.log('Database tables created successfully');
      } catch (sqlError) {
        console.error('Error creating tables through SQL:', sqlError);
        
        // Fallback: Use simplified versions of the tables without constraints
        try {
          // Insert directly without sophisticated constraints
          const { error: insertError } = await supabase
            .from('exhibitors')
            .insert({
              name: 'Test Exhibitor',
              slug: 'test-exhibitor',
              booth_info: 'Test Booth',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              claimed: false
            });
            
          if (insertError) {
            console.error('Failed to create tables:', insertError);
          } else {
            console.log('Database tables initialized with test record');
          }
        } catch (insertError) {
          console.error('Failed to initialize tables:', insertError);
        }
      }
    } else if (error) {
      console.error('Error checking exhibitors table:', error);
    } else {
      console.log('Database tables already exist');
    }
  } catch (error) {
    console.error('Error checking/creating tables:', error);
  }
} 
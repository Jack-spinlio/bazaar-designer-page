#!/usr/bin/env node

/**
 * Database setup script
 * This script creates the necessary tables in Supabase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase connection info
const supabaseUrl = process.env.SUPABASE_URL || 'https://dnauvvkfpmtquaysfdvm.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuYXV2dmtmcG10cXVheXNmZHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNDM3ODMsImV4cCI6MjA1NjcxOTc4M30.8SOHVw4a6ht6AGycVYw4MjbBpNFXi7Rc3wvUJ717ZZM';

async function setupDatabase() {
  console.log('Setting up database tables...');

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check if exhibitors table exists
    const { data, error } = await supabase
      .from('exhibitors')
      .select('id')
      .limit(1);
    
    if (!error) {
      console.log('Database tables already exist');
      return;
    }

    if (error && error.code === '42P01') {
      console.log('Exhibitors table does not exist. Creating database schema...');
      
      // Read the SQL file
      const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240326-create-exhibitor-tables.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      // First, enable uuid-ossp extension which is required for uuid_generate_v4()
      try {
        const { error: extError } = await supabase.rpc('pg_sql_execute', { 
          command: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' 
        });
        
        if (extError) {
          console.error('Error enabling uuid-ossp extension:', extError);
        }
      } catch (extError) {
        console.error('Failed to enable uuid-ossp extension:', extError);
      }
      
      // Execute the SQL statements
      try {
        const { error: sqlError } = await supabase.rpc('pg_sql_execute', { 
          command: sql 
        });
        
        if (sqlError) {
          console.error('Error executing SQL:', sqlError);
          console.log('Trying alternative approach with individual statements...');
          
          // Break the SQL into individual statements
          const statements = sql.split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);
          
          console.log(`Found ${statements.length} SQL statements to execute`);
          
          // Execute each statement separately
          for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`Executing statement ${i+1}/${statements.length}...`);
            
            try {
              const { error: stmtError } = await supabase.rpc('pg_sql_execute', { 
                command: statement + ';' 
              });
              
              if (stmtError) {
                console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
                console.error(stmtError);
              }
            } catch (stmtError) {
              console.error(`Failed to execute statement ${i+1}:`, stmtError);
            }
          }
        } else {
          console.log('SQL executed successfully');
        }
      } catch (sqlError) {
        console.error('Failed to execute SQL:', sqlError);
      }
      
      // Verify tables were created
      const { data: verifyData, error: verifyError } = await supabase
        .from('exhibitors')
        .select('id')
        .limit(1);
      
      if (verifyError) {
        console.error('Failed to create tables:', verifyError);
      } else {
        console.log('Database tables created successfully!');
      }
    } else {
      console.error('Error checking exhibitors table:', error);
    }
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run setup
setupDatabase()
  .then(() => {
    console.log('Database setup process complete');
  })
  .catch(error => {
    console.error('Setup failed:', error);
  }); 
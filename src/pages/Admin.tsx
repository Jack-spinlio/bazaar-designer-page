import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header/Header';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const [creating, setCreating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const createTables = async () => {
    setCreating(true);
    addLog('Starting database setup...');

    try {
      // Step 1: Create exhibitors table if it doesn't exist
      addLog('Creating exhibitors table...');
      const { error: exhibitorsError } = await supabase.from('exhibitors').select('id').limit(1);
      
      if (exhibitorsError && exhibitorsError.code === '42P01') {
        // Table doesn't exist, try to create it
        const { error: createError } = await supabase
          .from('exhibitors')
          .insert({
            name: 'Test Exhibitor',
            slug: 'test-exhibitor',
            booth_info: 'Test Booth',
            claimed: false
          });
        
        if (createError) {
          addLog(`Error creating exhibitors table: ${createError.message}`);
          toast.error('Failed to create tables');
        } else {
          addLog('Successfully created exhibitors table');
          toast.success('Tables created successfully');
        }
      } else if (exhibitorsError) {
        addLog(`Error checking exhibitors table: ${exhibitorsError.message}`);
      } else {
        addLog('Exhibitors table already exists');
      }
      
      // Step 2: Check gallery table
      addLog('Checking exhibitor_gallery table...');
      const { error: galleryError } = await supabase.from('exhibitor_gallery').select('id').limit(1);
      
      if (galleryError && galleryError.code === '42P01') {
        // Get the first exhibitor to use as a reference
        const { data: exhibitor } = await supabase.from('exhibitors').select('id').limit(1).single();
        
        if (exhibitor) {
          // Create a test gallery entry
          const { error: createGalleryError } = await supabase
            .from('exhibitor_gallery')
            .insert({
              exhibitor_id: exhibitor.id,
              image_url: 'https://example.com/test.jpg',
              display_order: 0
            });
          
          if (createGalleryError) {
            addLog(`Error creating gallery table: ${createGalleryError.message}`);
          } else {
            addLog('Successfully created exhibitor_gallery table');
          }
        } else {
          addLog('No exhibitor found to create gallery relation');
        }
      } else if (galleryError) {
        addLog(`Error checking gallery table: ${galleryError.message}`);
      } else {
        addLog('Gallery table already exists');
      }
      
    } catch (error) {
      addLog(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      toast.error('Error during setup');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
              <CardDescription>Create the required tables in Supabase</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={createTables} 
                disabled={creating}
                className="w-full"
              >
                {creating ? 'Creating Tables...' : 'Create Tables'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Logs</CardTitle>
              <CardDescription>Setup process logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded h-48 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500 italic">No logs yet</p>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="text-sm mb-1">{log}</div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin; 
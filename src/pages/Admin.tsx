
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header/Header';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const createTables = async () => {
    setCreating(true);
    addLog('Starting database setup...');

    try {
      // Step 1: Create exhibitors table if it doesn't exist
      addLog('Checking exhibitors table...');
      const { error: exhibitorsError } = await supabase.from('exhibitors').select('id').limit(1);
      
      if (exhibitorsError) {
        addLog(`Error checking exhibitors table: ${exhibitorsError.message}`);
        toast.error('Tables need to be created. Please run the SQL migration first.');
      } else {
        addLog('Exhibitors table exists');
        toast.success('Tables already created');
      }
    } catch (error) {
      addLog(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      toast.error('Error during setup');
    } finally {
      setCreating(false);
    }
  };

  const importExhibitors = async () => {
    setImporting(true);
    addLog('Starting exhibitor import...');

    try {
      // Fetch the JSON data
      addLog('Fetching exhibitor data from JSON file...');
      const response = await fetch('/all-exhibitors-alpha.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }
      
      const exhibitors = await response.json();
      addLog(`Found ${exhibitors.length} exhibitors in JSON file`);
      
      // Import in batches to avoid timeouts
      const batchSize = 20;
      const batches = Math.ceil(exhibitors.length / batchSize);
      let importedCount = 0;
      
      for (let i = 0; i < batches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, exhibitors.length);
        const batch = exhibitors.slice(start, end);
        
        addLog(`Processing batch ${i+1}/${batches} (${batch.length} exhibitors)...`);
        
        // Process exhibitors in current batch
        for (const exhibitor of batch) {
          try {
            // Check if exhibitor already exists
            const { data: existing } = await supabase
              .from('exhibitors')
              .select('id')
              .eq('slug', exhibitor.slug)
              .maybeSingle();
            
            if (existing) {
              addLog(`Exhibitor ${exhibitor.name || exhibitor.exhibitor_name} already exists, skipping...`);
              continue;
            }
            
            // Insert exhibitor
            const { data: newExhibitor, error: insertError } = await supabase
              .from('exhibitors')
              .insert({
                name: exhibitor.name || exhibitor.exhibitor_name,
                slug: exhibitor.slug,
                booth_info: exhibitor.booth_info,
                address: exhibitor.address,
                telephone: exhibitor.telephone,
                fax: exhibitor.fax,
                website: exhibitor.website,
                email: exhibitor.email,
                products: exhibitor.products,
                description: exhibitor.description,
                thumbnail_url: exhibitor.thumbnail_url,
                source_url: exhibitor.source_url
              })
              .select('id')
              .single();
            
            if (insertError) {
              addLog(`Error inserting exhibitor ${exhibitor.name || exhibitor.exhibitor_name}: ${insertError.message}`);
              continue;
            }
            
            // Insert gallery images if any
            if (exhibitor.gallery_images && exhibitor.gallery_images.length > 0 && newExhibitor) {
              const galleryEntries = exhibitor.gallery_images.map((url: string, index: number) => ({
                exhibitor_id: newExhibitor.id,
                image_url: url,
                display_order: index
              }));
              
              const { error: galleryError } = await supabase
                .from('exhibitor_gallery')
                .insert(galleryEntries);
              
              if (galleryError) {
                addLog(`Error inserting gallery for ${exhibitor.name || exhibitor.exhibitor_name}: ${galleryError.message}`);
              } else {
                addLog(`Added ${galleryEntries.length} gallery images for ${exhibitor.name || exhibitor.exhibitor_name}`);
              }
            }
            
            importedCount++;
            addLog(`Imported exhibitor: ${exhibitor.name || exhibitor.exhibitor_name}`);
          } catch (error) {
            addLog(`Error processing exhibitor: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      }
      
      toast.success(`Successfully imported ${importedCount} exhibitors`);
      addLog(`Import completed. Imported ${importedCount} exhibitors.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addLog(`Import failed: ${message}`);
      toast.error(`Import failed: ${message}`);
    } finally {
      setImporting(false);
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
              <CardDescription>Check database tables status</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={createTables} 
                disabled={creating}
                className="w-full"
              >
                {creating ? 'Checking Tables...' : 'Check Tables'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Import</CardTitle>
              <CardDescription>Import exhibitors from JSON to database</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={importExhibitors} 
                disabled={importing}
                className="w-full"
              >
                {importing ? 'Importing Exhibitors...' : 'Import Exhibitors'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Logs</CardTitle>
              <CardDescription>Process logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500 italic">No logs yet</p>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="text-sm mb-1 font-mono">{log}</div>
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

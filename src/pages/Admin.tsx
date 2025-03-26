
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header/Header';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const analyzeExhibitors = async () => {
    addLog('Starting exhibitor data analysis...');

    try {
      // Fetch the JSON data
      addLog('Fetching exhibitor data from JSON file...');
      const response = await fetch('/all-exhibitors-alpha.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }
      
      const exhibitors = await response.json();
      
      if (!exhibitors || !Array.isArray(exhibitors)) {
        throw new Error('Invalid data format in JSON file');
      }
      
      addLog(`Found ${exhibitors.length} exhibitors in JSON file`);
      
      // Analyze data
      const withProducts = exhibitors.filter(e => e.products && e.products.trim().length > 0).length;
      const withDescription = exhibitors.filter(e => e.description && e.description.trim().length > 0).length;
      const withGallery = exhibitors.filter(e => e.gallery_images && e.gallery_images.length > 0).length;
      
      // Count default thumbnails
      const defaultThumbnail = "https://storage.googleapis.com/www.taiwantradeshow.com.tw/ttsShowYear/202406/T-68557044.jpg";
      const withDefaultThumbnail = exhibitors.filter(e => e.thumbnail_url === defaultThumbnail).length;
      
      // Display analysis
      addLog(`Exhibitors with products: ${withProducts} (${Math.round(withProducts/exhibitors.length*100)}%)`);
      addLog(`Exhibitors with descriptions: ${withDescription} (${Math.round(withDescription/exhibitors.length*100)}%)`);
      addLog(`Exhibitors with gallery images: ${withGallery} (${Math.round(withGallery/exhibitors.length*100)}%)`);
      addLog(`Exhibitors with default thumbnail: ${withDefaultThumbnail} (${Math.round(withDefaultThumbnail/exhibitors.length*100)}%)`);
      
      toast.success('Analysis complete');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addLog(`Analysis failed: ${message}`);
      toast.error(`Analysis failed: ${message}`);
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
              <CardTitle>Exhibitor Data Analysis</CardTitle>
              <CardDescription>Analyze the exhibitor data from JSON file</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={analyzeExhibitors}
                className="w-full"
              >
                Analyze Exhibitor Data
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

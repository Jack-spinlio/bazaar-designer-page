
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, X, FileType } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';

const Uploads = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [componentName, setComponentName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const allowedTypes = ['.stl', '.obj', '.step', '.stp', '.glb', '.gltf', '.gh', '.ghx'];
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(`Invalid file type. Please upload ${allowedTypes.join(', ')} files.`);
      return;
    }
    
    setFile(file);
    
    // Auto-set the component name from the file name (remove extension)
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    setComponentName(nameWithoutExtension);
  };
  
  const handleClose = () => {
    navigate('/edit');
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!componentName.trim()) {
      toast.error('Please enter a component name');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create a unique file path with timestamp to avoid collisions
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}_${componentName.replace(/\s+/g, '_')}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('models')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('File uploaded successfully');
      setFile(null);
      setComponentName('');
      setCategory('');
      setSubCategory('');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setComponentName('');
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
          <p className="text-gray-600">Upload and manage your components for the marketplace</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upload New Component</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What are you uploading?</label>
              <input 
                type="text" 
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select 
                className="w-full p-2 border rounded" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                <option value="fork">Fork</option>
                <option value="frame">Frame</option>
                <option value="handlebar">Handlebar</option>
                <option value="wheel">Wheel</option>
                <option value="saddle">Saddle</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Category</label>
              <select 
                className="w-full p-2 border rounded"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="">Select sub-category</option>
                <option value="rigid">Rigid</option>
                <option value="suspension">Suspension</option>
                <option value="carbon">Carbon</option>
                <option value="aluminum">Aluminum</option>
              </select>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center ${
                dragging
                  ? 'border-blue-500 bg-blue-50'
                  : file
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="text-center">
                  <FileType size={40} className="mx-auto mb-2 text-green-500" />
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex justify-center space-x-2 mt-2">
                    <button
                      type="button"
                      className="flex items-center text-red-500 hover:text-red-700"
                      onClick={handleRemoveFile}
                    >
                      <X size={16} className="mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <Upload size={40} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drag and drop or click to choose your .gh or .ghx file here
                    </p>
                    <p className="text-xs text-gray-500">
                      Max file size: 10 MB
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept={allowedTypes.join(',')}
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="mt-3"
                      >
                        Select File
                      </Button>
                    </label>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-3">
              <Button 
                onClick={handleUpload} 
                disabled={!file || !componentName || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Uploads;

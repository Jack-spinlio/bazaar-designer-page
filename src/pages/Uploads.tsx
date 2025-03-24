
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, X, FileType, Download, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Uploads = () => {
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
      <div className="h-screen w-full bg-gradient-to-br from-gray-800 to-black">
        <div className="max-w-2xl mx-auto pt-24">
          <Card className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="text-xl font-semibold text-center">List a Product</DialogTitle>
              <p className="text-gray-500 text-sm text-center">What are you uploading?</p>
              <DialogClose className="absolute right-4 top-4">
                <X className="h-4 w-4" />
              </DialogClose>
            </DialogHeader>
            
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fork" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fork">Fork</SelectItem>
                    <SelectItem value="frame">Frame</SelectItem>
                    <SelectItem value="handlebar">Handlebar</SelectItem>
                    <SelectItem value="wheel">Wheel</SelectItem>
                    <SelectItem value="saddle">Saddle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sub Category</label>
                <Select value={subCategory} onValueChange={setSubCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rigid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rigid">Rigid</SelectItem>
                    <SelectItem value="suspension">Suspension</SelectItem>
                    <SelectItem value="carbon">Carbon</SelectItem>
                    <SelectItem value="aluminum">Aluminum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 transition-colors flex flex-col items-center justify-center ${
                    dragging
                      ? 'border-gray-400 bg-gray-50'
                      : file
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {!file ? (
                    <>
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <Upload size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1 text-center">
                        Drag and drop or click to choose your .gh or .ghx file here
                      </p>
                      <p className="text-xs text-gray-500 text-center">
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
                          className="mt-4"
                        >
                          Browse Files
                        </Button>
                      </label>
                    </>
                  ) : (
                    <div className="w-full">
                      <div className="flex items-center border rounded-lg p-3 bg-white">
                        <div className="bg-red-100 p-2 rounded mr-3">
                          <FileType size={20} className="text-red-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{Math.round(file.size / 1024)}kb</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700">
                            <Download size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-gray-500 hover:text-red-600"
                            onClick={handleRemoveFile}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center p-6 pt-0">
              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-6"
                onClick={handleUpload} 
                disabled={!file || !componentName || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Uploads;

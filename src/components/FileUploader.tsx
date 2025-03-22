
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, X, FileType } from 'lucide-react';
import { ComponentItem } from './Sidebar';
import { supabase } from '@/integrations/supabase/client';

interface FileUploaderProps {
  onClose: () => void;
  onFileUploaded?: (component: ComponentItem) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onClose,
  onFileUploaded 
}) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [componentName, setComponentName] = useState('');
  const [uploading, setUploading] = useState(false);

  const allowedTypes = ['.stl', '.obj', '.step', '.stp'];
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!componentName.trim()) {
      toast.error('Please enter a component name');
      return;
    }
    
    setUploading(true);
    
    try {
      // Create a unique file path with timestamp to avoid collisions
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}_${componentName.replace(/\s+/g, '_')}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('models')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true  // Changed from false to true to prevent RLS policy violations
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('models')
        .getPublicUrl(filePath);
      
      // Create a new component
      const newComponent: ComponentItem = {
        id: `uploaded-${Date.now()}`,
        name: componentName,
        type: fileExt?.toUpperCase() || 'STL',
        thumbnail: '/placeholder.svg',
        folder: 'Uploads',
        shape: 'box', // Default shape
        modelUrl: urlData.publicUrl // Store the public URL
      };
      
      // Add to components list
      if (onFileUploaded) {
        onFileUploaded(newComponent);
      }
      
      toast.success(`Component "${componentName}" uploaded successfully!`);
      setUploading(false);
      onClose();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Upload 3D Component</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center ${
            dragging
              ? 'border-app-blue bg-app-blue/5'
              : file
              ? 'border-green-500 bg-green-50'
              : 'border-app-gray-light/50 hover:border-app-blue/50 hover:bg-app-blue/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="text-center">
              <FileType size={40} className="mx-auto mb-2 text-green-500" />
              <p className="font-medium text-app-gray-dark">{file.name}</p>
              <p className="text-sm text-app-gray-light">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => setFile(null)}
              >
                Remove
              </Button>
            </div>
          ) : (
            <>
              <Upload size={40} className="text-app-gray-light mb-2" />
              <p className="text-sm text-center text-app-gray-dark mb-2">
                Drag & drop a 3D model file here, or click to browse
              </p>
              <p className="text-xs text-center text-app-gray-light">
                Supported formats: {allowedTypes.join(', ')}
              </p>
              <input
                type="file"
                accept={allowedTypes.join(',')}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="mt-4">
                <Button type="button" variant="outline" size="sm">
                  Browse Files
                </Button>
              </Label>
            </>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="componentName">Component Name</Label>
          <Input
            id="componentName"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            placeholder="Enter component name"
          />
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!file || !componentName || uploading}>
            {uploading ? 'Uploading...' : 'Upload Component'}
          </Button>
        </div>
      </form>
    </div>
  );
};

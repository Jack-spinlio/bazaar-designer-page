
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Download, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FileObject {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  size: number;
  mimetype: string;
}

// Define a simple FileUploader component for this page
const SimpleFileUploader = ({ onFileSelect, accept, isUploading }: {
  onFileSelect: (file: File) => void;
  accept: string;
  isUploading: boolean;
}) => {
  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={accept}
        onChange={(e) => e.target.files && e.target.files[0] && onFileSelect(e.target.files[0])}
        disabled={isUploading}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">
            Supported formats: .obj, .step, .stp, .stl, .fbx, .gltf, .glb, .3ds
          </p>
          {isUploading ? (
            <Button disabled className="mt-4">Uploading...</Button>
          ) : (
            <Button className="mt-4">Select File</Button>
          )}
        </div>
      </label>
    </div>
  );
};

const Uploads = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const fetchUserUploads = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('models')
        .list();
        
      if (error) throw error;
      
      if (data) {
        setFiles(data as unknown as FileObject[]);
      }
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast.error('Failed to load uploads');
    }
  };
  
  useEffect(() => {
    fetchUserUploads();
  }, []);
  
  const handleUpload = async (file: File) => {
    // Check if file type is supported
    const supportedTypes = ['.obj', '.step', '.stp', '.stl', '.fbx', '.gltf', '.glb', '.3ds'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!supportedTypes.includes(fileExt)) {
      toast.error(`Unsupported file type: ${fileExt}. Supported types: ${supportedTypes.join(', ')}`);
      return;
    }
    
    setIsUploading(true);
    
    try {
      const { error } = await supabase.storage
        .from('models')
        .upload(`${Date.now()}_${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      toast.success('File uploaded successfully');
      fetchUserUploads(); // Refresh the file list
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (fileName: string) => {
    try {
      const { error } = await supabase
        .storage
        .from('models')
        .remove([fileName]);
        
      if (error) throw error;
      
      toast.success('File deleted successfully');
      setFiles(files.filter(file => file.name !== fileName));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Uploads</h1>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload 3D Model</h2>
          <p className="text-sm text-gray-500 mb-4">
            Supported file types: .obj, .step, .stp, .stl, .fbx, .gltf, .glb, .3ds
          </p>
          
          <SimpleFileUploader 
            onFileSelect={handleUpload}
            accept=".obj,.step,.stp,.stl,.fbx,.gltf,.glb,.3ds"
            isUploading={isUploading}
          />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">My Models</h2>
          
          {files.length === 0 ? (
            <p className="text-gray-500">No uploads yet. Upload your first 3D model above.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate" title={file.name}>{file.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Uploaded: {new Date(file.created_at).toLocaleDateString()}
                  </p>
                  
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(supabase.storage.from('models').getPublicUrl(file.name).data.publicUrl)}
                    >
                      <Download size={16} className="mr-1" /> Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:text-red-700" 
                      onClick={() => handleDelete(file.name)}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Uploads;


import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ComponentItem } from '@/components/Sidebar';

export const allowedModelTypes = ['.stl', '.obj', '.step', '.stp'];

export const validateFile = (file: File, allowedTypes: string[]): boolean => {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    toast.error(`Invalid file type. Please upload ${allowedTypes.join(', ')} files.`);
    return false;
  }
  
  return true;
};

export const getFileNameWithoutExtension = (fileName: string): string => {
  return fileName.replace(/\.[^/.]+$/, "");
};

export const uploadModelFile = async (
  file: File, 
  componentName: string
): Promise<ComponentItem | null> => {
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
    
    return newComponent;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    return null;
  }
};

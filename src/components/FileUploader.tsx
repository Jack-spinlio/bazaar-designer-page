
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { ComponentItem } from './Sidebar';
import { DragDropZone } from './upload/DragDropZone';
import { 
  allowedModelTypes, 
  validateFile, 
  getFileNameWithoutExtension,
  uploadModelFile 
} from '@/utils/fileUpload';

interface FileUploaderProps {
  onClose: () => void;
  onFileUploaded?: (component: ComponentItem) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onClose,
  onFileUploaded 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [componentName, setComponentName] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const validateAndSetFile = (file: File) => {
    if (validateFile(file, allowedModelTypes)) {
      setFile(file);
      
      // Auto-set the component name from the file name (remove extension)
      const nameWithoutExtension = getFileNameWithoutExtension(file.name);
      setComponentName(nameWithoutExtension);
    }
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
    
    const newComponent = await uploadModelFile(file, componentName);
    
    if (newComponent && onFileUploaded) {
      onFileUploaded(newComponent);
      toast.success(`Component "${componentName}" uploaded successfully!`);
      onClose();
    }
    
    setUploading(false);
  };

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <DragDropZone 
          file={file}
          setFile={setFile}
          validateAndSetFile={validateAndSetFile}
          allowedTypes={allowedModelTypes}
        />
        
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
          <Button 
            type="submit" 
            disabled={!file || !componentName || uploading}
            className="bg-[#000000] hover:bg-[#000000]/90 text-white"
          >
            {uploading ? 'Uploading...' : 'Upload Component'}
          </Button>
        </div>
      </form>
    </div>
  );
};

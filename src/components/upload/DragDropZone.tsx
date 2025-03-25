
import { useState, useRef } from 'react';
import { FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DragDropZoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  validateAndSetFile: (file: File) => void;
  allowedTypes: string[];
}

export const DragDropZone = ({ 
  file, 
  setFile, 
  validateAndSetFile, 
  allowedTypes 
}: DragDropZoneProps) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  return (
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
          <Input
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
          />
          <Label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
            <div className="text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-app-gray-light mb-2 mx-auto"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p className="text-sm text-center text-app-gray-dark mb-2">
                Drag & drop a 3D model file here, or click to browse
              </p>
              <p className="text-xs text-center text-app-gray-light">
                Supported formats: {allowedTypes.join(', ')}
              </p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
            </div>
          </Label>
        </>
      )}
    </div>
  );
};

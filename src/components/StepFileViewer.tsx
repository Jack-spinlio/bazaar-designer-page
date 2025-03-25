
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Info, FileWarning } from 'lucide-react';
import { ComponentItem } from './Sidebar';

interface StepFileViewerProps {
  component: ComponentItem;
  onClose: () => void;
}

export const StepFileViewer: React.FC<StepFileViewerProps> = ({
  component,
  onClose
}) => {
  const [showDialog, setShowDialog] = useState(true);
  
  const handleClose = () => {
    setShowDialog(false);
    if (onClose) onClose();
  };
  
  const fileUrl = component.modelUrl || '';
  const fileName = component.name || 'STEP file';
  
  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <FileWarning className="text-amber-500" size={20} />
            STEP File Viewer - {fileName}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4 text-amber-800 flex gap-2">
              <Info size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">STEP files cannot be directly displayed in browsers</p>
                <p className="text-sm">STEP files are CAD format files that require conversion before they can be viewed in a web browser.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">File Details</h3>
                <p className="text-sm text-muted-foreground">Name: {component.name}</p>
                <p className="text-sm text-muted-foreground truncate">Location: {fileUrl}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Options</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-100 p-1 rounded-full text-blue-700">1</span>
                    A placeholder model will be used to represent the STEP file in the 3D viewport
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-100 p-1 rounded-full text-blue-700">2</span>
                    Download the STEP file to view it in CAD software
                  </li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-between items-center">
          <div>
            <Button 
              variant="outline" 
              onClick={() => window.open(fileUrl, '_blank')}
              className="text-sm"
            >
              Download STEP File
            </Button>
          </div>
          <div className="flex gap-2">
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose}>Continue with Placeholder</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

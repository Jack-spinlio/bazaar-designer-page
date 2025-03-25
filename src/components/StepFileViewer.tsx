
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Info, FileWarning, FileIcon } from 'lucide-react';
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
      <AlertDialogContent className="max-w-xl p-0 overflow-hidden border-0">
        <div className="bg-white rounded-t-lg">
          <AlertDialogHeader className="p-6 pb-4">
            <AlertDialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <FileIcon className="text-amber-500" size={22} />
              STEP File Viewer - {fileName}
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <AlertDialogDescription className="p-0">
            <div className="mx-6 p-4 bg-amber-50 border border-amber-200 rounded-md mb-5 text-amber-800 flex gap-3">
              <Info size={20} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">STEP files cannot be directly displayed in browsers</p>
                <p className="text-amber-700">STEP files are CAD format files that require conversion before they can be viewed in a web browser.</p>
              </div>
            </div>
            
            <div className="px-6 pb-6 space-y-5">
              <div>
                <h3 className="font-medium text-gray-800 mb-2 text-sm">File Details</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Name: <span className="text-gray-800">{component.name}</span></p>
                  <p className="text-sm text-gray-600 truncate">Location: <span className="text-gray-800 text-xs">{fileUrl}</span></p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2 text-sm">Options</h3>
                <ul className="text-sm space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-sm font-medium">1</span>
                    <span className="text-gray-700 mt-0.5">A placeholder model will be used to represent the STEP file in the 3D viewport</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-sm font-medium">2</span>
                    <span className="text-gray-700 mt-0.5">Download the STEP file to view it in CAD software</span>
                  </li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </div>
        
        <AlertDialogFooter className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
          <div>
            <Button 
              variant="outline" 
              onClick={() => window.open(fileUrl, '_blank')}
              className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium"
            >
              Download STEP File
            </Button>
          </div>
          <div className="flex gap-2">
            <AlertDialogCancel 
              onClick={handleClose}
              className="border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClose}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
            >
              Continue with Placeholder
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

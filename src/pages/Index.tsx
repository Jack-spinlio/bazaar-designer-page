
import { Layout } from '@/components/Layout';
import { useEffect } from 'react';
import { toast } from 'sonner';

const Index = () => {
  useEffect(() => {
    // Welcome toast when the application loads
    const timeoutId = setTimeout(() => {
      toast('Welcome to 3D Component Snap Point Manager', {
        description: 'Upload 3D models and define snap points for easy assembly',
        action: {
          label: 'Get Started',
          onClick: () => toast.info('Try clicking "Add Snap Point" in the 3D viewport')
        },
      });
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Layout />
  );
};

export default Index;

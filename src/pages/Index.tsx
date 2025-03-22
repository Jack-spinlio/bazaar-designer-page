
import { Layout } from '@/components/Layout';
import { useEffect } from 'react';
import { toast } from 'sonner';

const Index = () => {
  useEffect(() => {
    // Welcome toast when the application loads
    const timeoutId = setTimeout(() => {
      toast('Welcome to Bazaar', {
        description: 'Select bike components from the sidebar and place them in the 3D viewport',
      });
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Layout />
  );
};

export default Index;

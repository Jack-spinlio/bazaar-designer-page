
import React from 'react';
import { Layout } from '@/components/Layout';

const Index = () => {
  return (
    <Layout>
      <div className="w-full h-full p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Welcome to Bazaar</h1>
          <p className="text-sm md:text-base lg:text-lg">
            Your platform for designing and customizing bikes. Start by exploring the sidebar options.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

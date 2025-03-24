
import React from 'react';
import { Layout } from '@/components/Layout';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';

const Uploads = () => {
  return (
    <Layout sidebar={<SupplierSidebar />}>
      <div className="flex flex-col h-full w-full p-6 bg-white rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Uploads Page</h1>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No content yet</p>
        </div>
      </div>
    </Layout>
  );
};

export default Uploads;

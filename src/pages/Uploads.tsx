
import React from 'react';
import { Layout } from '@/components/Layout';
import { SupplierSidebar } from '@/components/supplier/SupplierSidebar';

const Uploads = () => {
  return (
    <Layout sidebar={<SupplierSidebar />}>
      <div className="flex flex-col h-full w-full">
        <h1 className="text-2xl font-bold p-6">Uploads Page</h1>
        {/* We'll add the new content here */}
      </div>
    </Layout>
  );
};

export default Uploads;

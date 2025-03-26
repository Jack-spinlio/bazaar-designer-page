import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Upload, Users } from 'lucide-react';
import { StatsCard } from '@/components/supplier/StatsCard';
import { ProductsPopularityChart } from '@/components/supplier/ProductsPopularityChart';
import { CustomerInsightsChart } from '@/components/supplier/CustomerInsightsChart';

interface DashboardStats {
  totalProducts: number;
  categories: number;
  recentUploads: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
}

export const SupplierDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    categories: 0,
    recentUploads: []
  });
  const [loading, setLoading] = useState(true);

  const statsCardData = [
    {
      title: 'Revenue',
      value: '$150,000',
      change: 14.8,
      data: Array.from({ length: 20 }, (_, i) => ({ 
        value: 100 + Math.sin(i / 2) * 30 + Math.random() * 10 
      })),
      gradient: { from: '#10B981', to: '#0EA5E9' }
    },
    {
      title: 'Orders',
      value: '75',
      change: -2.5,
      data: Array.from({ length: 20 }, (_, i) => ({ 
        value: 80 + Math.cos(i / 3) * 20 + Math.random() * 10 
      })),
      gradient: { from: '#10B981', to: '#0EA5E9' }
    },
    {
      title: 'Draft Designs',
      value: '17,058',
      change: 93.3,
      data: Array.from({ length: 20 }, (_, i) => ({ 
        value: 90 + Math.sin(i / 2) * 25 + Math.random() * 15 
      })),
      gradient: { from: '#10B981', to: '#0EA5E9' }
    }
  ];

  const productsData = [
    { id: '1', name: 'eGravel Bike', popularity: 90, sales: 46, color: 'amber' },
    { id: '2', name: 'Electric Step-Thru', popularity: 75, sales: 17, color: 'teal' },
    { id: '3', name: 'Urban eBike', popularity: 60, sales: 19, color: 'blue' },
    { id: '4', name: 'Electric Road Bike', popularity: 45, sales: 5, color: 'purple' },
    { id: '5', name: 'Step-Thru Frame', popularity: 30, sales: 8, color: 'green' }
  ];

  const customerInsightsData = [
    { name: 'Jan', loyal: 300, new: 220, unique: 320 },
    { name: 'Feb', loyal: 280, new: 180, unique: 350 },
    { name: 'Mar', loyal: 240, new: 120, unique: 330 },
    { name: 'Apr', loyal: 200, new: 80, unique: 290 },
    { name: 'May', loyal: 180, new: 140, unique: 250 },
    { name: 'Jun', loyal: 220, new: 200, unique: 230 },
    { name: 'Jul', loyal: 270, new: 350, unique: 270 },
    { name: 'Aug', loyal: 300, new: 330, unique: 310 },
    { name: 'Sep', loyal: 260, new: 280, unique: 270 },
    { name: 'Oct', loyal: 220, new: 220, unique: 220 },
    { name: 'Nov', loyal: 180, new: 130, unique: 180 },
    { name: 'Dec', loyal: 140, new: 80, unique: 160 }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const mockStats = {
          totalProducts: 12,
          categories: 5,
          recentUploads: [
            { id: '1', name: 'Shimano 105 Groupset', created_at: new Date().toISOString() },
            { id: '2', name: 'Carbon Fiber Frame', created_at: new Date().toISOString() },
            { id: '3', name: 'Tubeless Tires', created_at: new Date().toISOString() },
          ]
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
        <Button asChild className="bg-black hover:bg-black/90">
          <Link to="/supplier/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Product
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCardData.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title} 
            value={stat.value} 
            change={stat.change} 
            data={stat.data}
            gradient={stat.gradient}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <ProductsPopularityChart products={productsData} />
      </div>
      
      <CustomerInsightsChart data={customerInsightsData} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/supplier/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Product
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/supplier/products">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading recent uploads...</p>
            ) : stats.recentUploads.length > 0 ? (
              <div className="space-y-2">
                {stats.recentUploads.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{product.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/supplier/products`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6">
                You haven't uploaded any products yet.
                <br />
                <Link to="/supplier/upload" className="text-blue-500 hover:underline">
                  Upload your first product
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

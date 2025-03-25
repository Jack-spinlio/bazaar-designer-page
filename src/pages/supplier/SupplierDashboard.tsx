
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Package, Upload, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock data for development without login
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
        toast.error('Failed to load dashboard data');
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-gray-500 mr-3" />
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats.totalProducts}
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/supplier/products">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-gray-500 mr-3" />
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.categories}
              </div>
            </div>
          </CardContent>
        </Card>
        
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
              <Link to="/supplier/edit-profile">
                <Users className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
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
                      <Link to={`/supplier/edit/${product.id}`}>
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
  );
};

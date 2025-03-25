
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Product {
  id: string;
  name: string;
  popularity: number;
  sales: number;
  color: string;
}

interface ProductsPopularityChartProps {
  products: Product[];
}

export const ProductsPopularityChart: React.FC<ProductsPopularityChartProps> = ({ products }) => {
  return (
    <Card className="shadow-sm col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
            <div>#</div>
            <div>Name</div>
            <div>Popularity</div>
            <div>Sales</div>
          </div>
          
          {products.map((product, index) => (
            <div key={product.id} className="grid grid-cols-4 items-center">
              <div className="text-sm font-medium">{String(index + 1).padStart(2, '0')}</div>
              <div className="font-medium">{product.name}</div>
              <div className="col-span-1 flex items-center">
                <Progress 
                  value={product.popularity} 
                  className="mr-2" 
                  indicatorClassName={`bg-gradient-to-r from-${product.color}-400 to-${product.color}-300`}
                />
              </div>
              <div className="text-sm">
                <span className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-${product.color}-100 text-${product.color}-700`}>
                  {product.sales}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

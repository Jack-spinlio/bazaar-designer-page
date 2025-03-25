
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ChartData {
  name: string;
  loyal: number;
  new: number;
  unique: number;
}

interface CustomerInsightsChartProps {
  data: ChartData[];
}

export const CustomerInsightsChart: React.FC<CustomerInsightsChartProps> = ({ data }) => {
  return (
    <Card className="shadow-sm col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Design Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="loyal" 
                name="Loyal Customers" 
                stroke="#8B5CF6" 
                strokeWidth={3} 
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="new" 
                name="New Customers" 
                stroke="#F97316" 
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="unique" 
                name="Unique Customers" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

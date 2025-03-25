
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  data: Array<{ value: number }>;
  gradient: {
    from: string;
    to: string;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change,
  data,
  gradient 
}) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-bold">{value}</h2>
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="inline-flex items-center justify-center rounded-full bg-black p-1">
              {isPositive ? 
                <TrendingUp className="h-3 w-3 text-green-500" /> : 
                <TrendingDown className="h-3 w-3 text-red-500" />
              }
            </span>
            <span className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-gray-500">from last month</span>
          </div>
        </div>
        
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradient.from} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={gradient.to} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={gradient.from} 
                fill={`url(#gradient-${title})`} 
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

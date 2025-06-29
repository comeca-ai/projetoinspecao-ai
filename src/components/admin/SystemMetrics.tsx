import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu,
  HardDrive,
  Database,
  Zap,
  Globe,
  Activity
} from 'lucide-react';

const SystemMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'CPU Usage',
      value: 45,
      icon: Cpu,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: '4 cores @ 2.4GHz'
    },
    {
      title: 'Memory Usage',
      value: 68,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: '27.2GB / 40GB'
    },
    {
      title: 'Disk Usage',
      value: 82,
      icon: HardDrive,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: '820GB / 1TB'
    },
    {
      title: 'Database Load',
      value: 34,
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: '340 connections'
    },
    {
      title: 'Network I/O',
      value: 56,
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: '1.2GB/s throughput'
    },
    {
      title: 'Power Usage',
      value: 78,
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: '780W / 1000W'
    }
  ];

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 75) return 'bg-orange-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}%
                </span>
                <span className="text-sm text-gray-500">{metric.description}</span>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={metric.value} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SystemMetrics;
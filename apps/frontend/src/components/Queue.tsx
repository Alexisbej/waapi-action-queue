import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { fetchActionQueue } from '../data-access';

const Queue: React.FC<{ limit?: number }> = ({ limit }) => {
  const {
    data: queue,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['queue'],
    queryFn: fetchActionQueue,
    refetchInterval: 15000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <Card className="w-full shadow-lg rounded-lg border border-gray-200">
      <CardHeader>
        <CardTitle>Action Queue</CardTitle>
        <CardDescription>
          Pending last {limit} actions to complete.
          {limit && ' See more in Action Queue page'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2">
          {queue?.slice(0, limit)?.map((action, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_100px_120px] items-center gap-4 rounded-md bg-gray-100 p-3 dark:bg-gray-800"
            >
              <div>
                <h4 className="font-medium">{action.title}</h4>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Type: {action.type}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                added at: {new Date(action.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Queue;

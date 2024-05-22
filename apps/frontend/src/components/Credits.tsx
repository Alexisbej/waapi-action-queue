import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { fetchCredits } from '../data-access';

const Credits: React.FC = () => {
  const {
    data: credits,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['credits'],
    queryFn: fetchCredits,
    refetchInterval: 15000,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full text-xl">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {(error as Error).message}
      </div>
    );

  return (
    <Card className="w-full max-w-lg shadow-lg rounded-lg border border-gray-200">
      <CardHeader className="p-6 rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Remaining Credits</CardTitle>
        <CardDescription className="text-sm">
          Your current credit balance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-4 p-6">
        {credits?.map((credit) => (
          <div
            className="text-3xl font-semibold bg-gray-100 p-4 rounded-lg shadow-md"
            key={credit.type}
          >
            {credit.type}: {credit.value}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Credits;

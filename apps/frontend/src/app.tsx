import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return <QueryClientProvider client={queryClient}></QueryClientProvider>;
};

export default App;

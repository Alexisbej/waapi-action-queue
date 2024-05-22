import { Sidebar } from '@/components/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Toaster } from '../components/ui/sonner';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="grid min-h-screen w-full grid-cols-[280px_1fr] overflow-hidden">
        <Sidebar />
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
      </div>
    </QueryClientProvider>
  ),
});

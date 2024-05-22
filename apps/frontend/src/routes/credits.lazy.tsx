import Credits from '@/components/Credits';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/credits')({
  component: () => (
    <div className="p-6">
      <Credits />
    </div>
  ),
});

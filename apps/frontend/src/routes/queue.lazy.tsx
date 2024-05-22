import Queue from '@/components/Queue';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/queue')({
  component: QueueRoute,
});

function QueueRoute() {
  return (
    <div className="p-6">
      <Queue />
    </div>
  );
}

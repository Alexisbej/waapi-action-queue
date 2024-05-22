import AddActionForm from '@/components/AddActionForm';
import Credits from '@/components/Credits';
import Queue from '@/components/Queue';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Queue limit={3} />
          <Credits />
        </div>
        <AddActionForm />
      </main>
    </div>
  );
}

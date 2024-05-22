import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { postAction } from '@/data-access';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { toast } from 'sonner';
import { z } from 'zod';
import { ActionType } from '../models';

export default function AddActionForm() {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      title: '',
      type: 'A' as ActionType,
      timestamp: new Date(),
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        const result = await postAction(value);
        queryClient.invalidateQueries({ queryKey: ['queue'] });
        queryClient.invalidateQueries({ queryKey: ['credits'] });
        form.reset();
        toast(`Action added: ${result.title} - type ${result.type}`);
      } catch (error) {
        toast(`Error adding action: ${error}`);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card className="w-full mx-auto shadow-lg rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle>Add New Action</CardTitle>
          <CardDescription>Create a new action to complete</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <form.Field
              name="title"
              validators={{
                onChange: z
                  .string()
                  .min(3, 'Title must be at least 3 characters'),
              }}
              children={(field) => (
                <>
                  <Input
                    id="title"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter action title"
                  />
                  {field.state.meta.errors ? (
                    <em role="alert">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </>
              )}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <form.Field
                name="type"
                validators={{
                  onChange: z.custom<ActionType>(),
                }}
                children={(field) => (
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as ActionType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">
            Add Action
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

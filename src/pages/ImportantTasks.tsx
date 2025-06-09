
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TaskCard from '@/components/TaskCard';
import { Input } from '@/components/ui/input';
import { Search, Star } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Task = Tables<'tasks'>;
type ChecklistItem = Tables<'checklist_items'>;

const ImportantTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['important-tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          checklist_items (*)
        `)
        .eq('user_id', user.id)
        .eq('is_important', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Task & { checklist_items: ChecklistItem[] })[];
    },
    enabled: !!user,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['important-tasks'] });
    },
  });

  const updateChecklistItemMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { error } = await supabase
        .from('checklist_items')
        .update({ is_completed: isCompleted })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['important-tasks'] });
    },
  });

  const filteredTasks = tasks?.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Star className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Important Tasks</h2>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search important tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleImportant={(taskId, isImportant) =>
                updateTaskMutation.mutate({ id: taskId, updates: { is_important: isImportant } })
              }
              onToggleStatus={(taskId, status) =>
                updateTaskMutation.mutate({ id: taskId, updates: { status } })
              }
              onToggleChecklistItem={(itemId, isCompleted) =>
                updateChecklistItemMutation.mutate({ id: itemId, isCompleted })
              }
              onClick={() => console.log('Open task details for:', task.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No important tasks</h3>
          <p className="text-muted-foreground">
            Mark tasks as important by clicking the star icon to see them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImportantTasks;

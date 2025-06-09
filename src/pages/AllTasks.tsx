import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TaskCard from '@/components/TaskCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Task = Tables<'tasks'>;
type ChecklistItem = Tables<'checklist_items'>;

const AllTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          checklist_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Task & { checklist_items: ChecklistItem[] })[];
    },
    enabled: !!user,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskTitle('');
      setShowCreateTask(false);
      toast({
        title: "Task created",
        description: "Your new task has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive",
      });
    },
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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const filteredTasks = tasks?.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      createTaskMutation.mutate(newTaskTitle.trim());
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Create Task */}
      {showCreateTask && (
        <div className="p-4 bg-card rounded-lg border">
          <div className="flex space-x-2">
            <Input
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
            />
            <Button onClick={handleCreateTask} disabled={!newTaskTitle.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button variant="outline" onClick={() => setShowCreateTask(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Tasks</h2>
        <Button onClick={() => setShowCreateTask(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Task Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredTasks.length})</TabsTrigger>
          <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value="progress">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
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
        </TabsContent>

        <TabsContent value="todo" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todoTasks.map((task) => (
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
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressTasks.map((task) => (
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
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedTasks.map((task) => (
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
        </TabsContent>
      </Tabs>

      {filteredTasks.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold mb-2">No tasks yet</h2>
          <p className="text-muted-foreground mb-6">Create your first task to get started!</p>
          <Button onClick={() => setShowCreateTask(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllTasks;

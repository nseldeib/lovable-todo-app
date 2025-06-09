
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Calendar, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Task = Tables<'tasks'>;
type ChecklistItem = Tables<'checklist_items'>;

interface TaskCardProps {
  task: Task & { checklist_items?: ChecklistItem[] };
  onToggleImportant: (taskId: string, isImportant: boolean) => void;
  onToggleStatus: (taskId: string, status: 'todo' | 'in_progress' | 'completed') => void;
  onToggleChecklistItem: (itemId: string, isCompleted: boolean) => void;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleImportant,
  onToggleStatus,
  onToggleChecklistItem,
  onClick
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedItems = task.checklist_items?.filter(item => item.is_completed).length || 0;
  const totalItems = task.checklist_items?.length || 0;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4" onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {task.emoji && <span className="text-lg">{task.emoji}</span>}
            <h3 className="font-medium text-gray-900">{task.title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleImportant(task.id, !task.is_important);
            }}
            className="p-1"
          >
            <Star
              className={`h-4 w-4 ${
                task.is_important ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
              }`}
            />
          </Button>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(task.priority || 'medium')}>
              {task.priority}
            </Badge>
            <Badge className={getStatusColor(task.status || 'todo')}>
              {task.status?.replace('_', ' ')}
            </Badge>
          </div>

          {task.due_date && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(task.due_date), 'MMM d')}
            </div>
          )}
        </div>

        {totalItems > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <div className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-1" />
                Checklist
              </div>
              <span>{completedItems}/{totalItems}</span>
            </div>
            <div className="space-y-1">
              {task.checklist_items?.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={item.is_completed || false}
                    onCheckedChange={(checked) => {
                      onToggleChecklistItem(item.id, checked as boolean);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className={`text-sm ${item.is_completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
              {totalItems > 3 && (
                <span className="text-xs text-gray-500">
                  +{totalItems - 3} more items
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              const nextStatus = task.status === 'todo' ? 'in_progress' : 
                              task.status === 'in_progress' ? 'completed' : 'todo';
              onToggleStatus(task.id, nextStatus);
            }}
          >
            {task.status === 'todo' ? 'Start' : 
             task.status === 'in_progress' ? 'Complete' : 'Reopen'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

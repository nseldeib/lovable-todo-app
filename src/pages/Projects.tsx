
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, FolderOpen, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'>;

const Projects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks(id, status)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Project & { tasks: { id: string; status: string }[] })[];
    },
    enabled: !!user,
  });

  const createProjectMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          description,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateProject(false);
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects?.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProjectMutation.mutate({ 
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || undefined
      });
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
      <div className="flex items-center space-x-3">
        <FolderOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">All Projects</h2>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Create Project */}
      {showCreateProject && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
            />
            <Input
              placeholder="Project description (optional)"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
              <Button variant="outline" onClick={() => setShowCreateProject(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={() => setShowCreateProject(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const totalTasks = project.tasks.length;
            const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to={`/projects/${project.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{project.emoji}</span>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                      <Badge variant="secondary">
                        {completionRate}%
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{totalTasks} tasks</span>
                      <span>{completedTasks} completed</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <FolderOpen className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first project to organize your tasks.
          </p>
          <Button onClick={() => setShowCreateProject(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default Projects;

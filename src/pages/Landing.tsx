
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Folder, Calendar, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-purple-400" />,
      title: "Task Management",
      description: "Organize and track your tasks with emoji-powered categories"
    },
    {
      icon: <Folder className="h-8 w-8 text-blue-400" />,
      title: "Project Organization",
      description: "Keep your projects structured and easy to navigate"
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-400" />,
      title: "Smart Scheduling",
      description: "Plan your day with intelligent task prioritization"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      title: "Priority Focus",
      description: "Highlight what matters most with importance markers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="text-6xl mb-4 block">📝</span>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              TaskFlow
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            A personal productivity app that transforms the way you organize tasks and projects with emoji-powered workflows
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              size="lg"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold px-8 py-3 text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personal Project Section */}
        <div className="text-center">
          <Card className="bg-slate-800/30 border-slate-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white mb-4">
                💡 Personal Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-lg leading-relaxed">
                TaskFlow is a personal productivity project built to explore modern web technologies 
                and create an intuitive task management experience. This demo showcases React, 
                TypeScript, and Supabase integration with a focus on clean design and user experience.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Built with React, TypeScript, Tailwind CSS, and Supabase
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

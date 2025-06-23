
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Folder, Calendar, Star, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-400" />,
      title: "Smart Task Management",
      description: "Organize and track your tasks with intelligent categorization and emoji-powered workflows"
    },
    {
      icon: <Folder className="h-8 w-8 text-cyan-400" />,
      title: "Project Organization",
      description: "Keep your projects structured with intuitive navigation and clean interfaces"
    },
    {
      icon: <Calendar className="h-8 w-8 text-violet-400" />,
      title: "Intelligent Scheduling",
      description: "Plan your day with smart task prioritization and deadline management"
    },
    {
      icon: <Star className="h-8 w-8 text-amber-400" />,
      title: "Priority Focus",
      description: "Highlight what matters most with importance markers and focus modes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:60px_60px]" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-20">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-2xl shadow-indigo-500/25">
                <span className="text-3xl">📝</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent mb-6 tracking-tight">
                TaskFlow
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-8" />
            </div>
            <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-4xl mx-auto font-light leading-relaxed">
              A modern productivity platform that transforms the way you organize 
              <span className="text-indigo-300 font-medium"> tasks and projects </span>
              with intelligent workflows
            </p>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
              Built as a personal project to explore cutting-edge web technologies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold px-10 py-4 text-lg rounded-xl shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105"
              >
                <Zap className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                size="lg"
                className="border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-indigo-400 hover:text-white font-semibold px-10 py-4 text-lg rounded-xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-900/40 border-slate-700/50 hover:bg-slate-900/60 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-slate-900/50 hover:scale-105 group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-xl bg-slate-800/50 group-hover:bg-slate-700/50 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Personal Project Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-br from-slate-900/60 to-indigo-900/40 border-slate-700/50 max-w-4xl mx-auto backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 mx-auto mb-6 shadow-lg">
                  <span className="text-2xl">💡</span>
                </div>
                <CardTitle className="text-3xl text-white mb-6 font-bold">
                  Personal Innovation Project
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-slate-300 text-xl leading-relaxed">
                  TaskFlow represents my exploration into modern web development, combining 
                  <span className="text-indigo-300 font-semibold"> React, TypeScript, and Supabase </span>
                  to create an intuitive task management experience. This demo showcases clean design principles, 
                  responsive interfaces, and seamless user interactions.
                </CardDescription>
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vite'].map((tech) => (
                    <span key={tech} className="px-4 py-2 bg-slate-800/50 text-slate-300 rounded-full text-sm font-medium border border-slate-600/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 py-8 bg-slate-950/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-500 font-medium">
              Crafted with modern web technologies for optimal performance and user experience
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;

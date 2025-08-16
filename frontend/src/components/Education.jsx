import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BookOpen, 
  Award, 
  PlayCircle, 
  CheckCircle, 
  Clock,
  Star,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../App';

const Education = () => {
  const { user, userStats } = useAuth();
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState({
    modules_completed: 5,
    total_points_earned: 120,
    certifications_earned: 2,
    current_streak: 7
  });

  // Mock educational modules data
  const mockModules = [
    {
      id: '1',
      title: 'Solar Power Basics',
      description: 'Learn the fundamentals of solar energy and how it can save you money',
      type: 'interactive',
      difficulty: 'beginner',
      category: 'solar',
      duration_minutes: 10,
      points_reward: 25,
      is_completed: true,
      progress: 100
    },
    {
      id: '2',
      title: 'Water Conservation Mastery',
      description: 'Master water-saving techniques for maximum impact and savings',
      type: 'quiz',
      difficulty: 'intermediate',
      category: 'water',
      duration_minutes: 15,
      points_reward: 30,
      is_completed: false,
      progress: 60
    },
    {
      id: '3',
      title: 'Sustainable Transportation',
      description: 'Explore eco-friendly transport options and their environmental impact',
      type: 'article',
      difficulty: 'beginner',
      category: 'transport',
      duration_minutes: 8,
      points_reward: 20,
      is_completed: false,
      progress: 0
    },
    {
      id: '4',
      title: 'Energy Efficiency at Home',
      description: 'Comprehensive guide to reducing home energy consumption',
      type: 'interactive',
      difficulty: 'advanced',
      category: 'electricity',
      duration_minutes: 20,
      points_reward: 40,
      is_completed: true,
      progress: 100
    },
    {
      id: '5',
      title: 'Sustainability Fundamentals',
      description: 'Understanding the core principles of sustainable living',
      type: 'video',
      difficulty: 'beginner',
      category: 'sustainability',
      duration_minutes: 12,
      points_reward: 25,
      is_completed: false,
      progress: 25
    }
  ];

  useEffect(() => {
    setModules(mockModules);
  }, []);

  const getTypeIcon = (type) => {
    const icons = {
      article: BookOpen,
      interactive: Target,
      quiz: Award,
      video: PlayCircle
    };
    return icons[type] || BookOpen;
  };

  const getTypeColor = (type) => {
    const colors = {
      article: 'bg-blue-100 text-blue-700',
      interactive: 'bg-green-100 text-green-700',
      quiz: 'bg-purple-100 text-purple-700',
      video: 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 border-green-200',
      intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      advanced: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const categories = ['all', 'sustainability', 'solar', 'water', 'transport', 'electricity'];
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredModules = modules.filter(module => 
    selectedCategory === 'all' || module.category === selectedCategory
  );

  const startModule = (moduleId) => {
    // In real implementation, this would navigate to the module content
    console.log('Starting module:', moduleId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-blue-100 rounded-full">
          <BookOpen className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sustainability Center</h1>
          <p className="text-gray-600">Learn, grow, and earn points while building sustainability knowledge</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Modules Completed</p>
                <p className="text-2xl font-bold text-blue-700">{userProgress.modules_completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Education Points</p>
                <p className="text-2xl font-bold text-green-700">{userProgress.total_points_earned}</p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certifications</p>
                <p className="text-2xl font-bold text-purple-700">{userProgress.certifications_earned}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Learning Streak</p>
                <p className="text-2xl font-bold text-orange-700">{userProgress.current_streak} days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const TypeIcon = getTypeIcon(module.type);
          
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-full ${getTypeColor(module.type)}`}>
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getDifficultyColor(module.difficulty)}
                  >
                    {module.difficulty}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                {module.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                )}
                
                {/* Module Details */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{module.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{module.points_reward} pts</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <Button 
                  onClick={() => startModule(module.id)}
                  className="w-full"
                  variant={module.is_completed ? "outline" : "default"}
                >
                  {module.is_completed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Review
                    </>
                  ) : module.progress > 0 ? (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Learning
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Tips Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">💡 Quick Sustainability Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Energy Saving</h4>
              <ul className="space-y-1 text-green-600">
                <li>• Switch to LED bulbs (85% energy saving)</li>
                <li>• Set AC to 24°C instead of 18°C (24% energy saving)</li>
                <li>• Unplug devices when not in use</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Water Conservation</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• Fix leaky taps immediately (saves 15L/day)</li>
                <li>• Use bucket instead of shower (saves 150L)</li>
                <li>• Collect rainwater during monsoons</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Education;
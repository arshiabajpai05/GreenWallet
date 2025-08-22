import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Leaf, 
  Sun, 
  TreePine, 
  Droplets, 
  Car, 
  Zap,
  Globe,
  Lightbulb,
  Target
} from 'lucide-react';

const Education = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const articles = [
    {
      id: 1,
      title: "Understanding Climate Change: The Science Behind Global Warming",
      category: "climate",
      readTime: "8 min",
      description: "Learn about greenhouse gases, carbon footprint, and how human activities contribute to climate change.",
      icon: Globe,
      content: "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, scientific evidence shows that human activities have been the main driver of climate change since the 1800s..."
    },
    {
      id: 2,
      title: "How Solar Panels Work: From Sunlight to Electricity",
      category: "solar",
      readTime: "6 min",
      description: "Discover the photovoltaic process and how solar energy can power your home efficiently.",
      icon: Sun,
      content: "Solar panels convert sunlight into electricity through photovoltaic cells. When sunlight hits these cells, it knocks electrons loose from atoms, generating a flow of electricity..."
    },
    {
      id: 3,
      title: "The Power of Trees: How Afforestation Fights Climate Change",
      category: "afforestation",
      readTime: "7 min",
      description: "Explore how trees absorb CO₂, produce oxygen, and create sustainable ecosystems.",
      icon: TreePine,
      content: "Trees are nature's carbon capture technology. A single mature tree can absorb 48 pounds of CO₂ per year and produce enough oxygen for two people..."
    },
    {
      id: 4,
      title: "Water Conservation at Home: Simple Steps, Big Impact",
      category: "water",
      readTime: "5 min",
      description: "Practical tips for reducing water consumption and implementing rainwater harvesting.",
      icon: Droplets,
      content: "Water conservation starts at home. Simple changes like fixing leaks, using low-flow fixtures, and collecting rainwater can reduce your water bill by 30-40%..."
    },
    {
      id: 5,
      title: "Sustainable Transportation: Choosing Eco-Friendly Options",
      category: "transport",
      readTime: "6 min",
      description: "Compare the environmental impact of different transportation modes and make informed choices.",
      icon: Car,
      content: "Transportation accounts for about 24% of global CO₂ emissions. By choosing public transport, cycling, or electric vehicles, you can significantly reduce your carbon footprint..."
    },
    {
      id: 6,
      title: "Energy Efficiency: Reducing Electricity Consumption",
      category: "electricity",
      readTime: "5 min",
      description: "Learn about energy-efficient appliances and habits that can cut your electricity bills.",
      icon: Zap,
      content: "Energy efficiency is about using less energy to provide the same service. LED bulbs use 75% less energy than incandescent bulbs and last 25 times longer..."
    },
    {
      id: 7,
      title: "Carbon Footprint Calculator: Understanding Your Impact",
      category: "climate",
      readTime: "4 min",
      description: "Learn how to calculate and reduce your personal carbon footprint effectively.",
      icon: Target,
      content: "Your carbon footprint is the total amount of greenhouse gases produced by your activities. The average Indian produces about 1.9 tons of CO₂ per year..."
    },
    {
      id: 8,
      title: "Green Living Tips: Sustainable Practices for Indian Households",
      category: "lifestyle",
      readTime: "9 min",
      description: "Comprehensive guide to adopting eco-friendly practices in your daily life.",
      icon: Lightbulb,
      content: "Green living involves making choices that are environmentally responsible. From composting kitchen waste to using natural cleaning products..."
    }
  ];

  const categories = [
    { value: 'all', label: 'All Topics', icon: BookOpen },
    { value: 'climate', label: 'Climate Change', icon: Globe },
    { value: 'solar', label: 'Solar Energy', icon: Sun },
    { value: 'afforestation', label: 'Afforestation', icon: TreePine },
    { value: 'water', label: 'Water Conservation', icon: Droplets },
    { value: 'transport', label: 'Transportation', icon: Car },
    { value: 'electricity', label: 'Energy Efficiency', icon: Zap },
    { value: 'lifestyle', label: 'Green Living', icon: Lightbulb }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      climate: 'bg-blue-100 text-blue-700',
      solar: 'bg-yellow-100 text-yellow-700',
      afforestation: 'bg-green-100 text-green-700',
      water: 'bg-cyan-100 text-cyan-700',
      transport: 'bg-purple-100 text-purple-700',
      electricity: 'bg-orange-100 text-orange-700',
      lifestyle: 'bg-emerald-100 text-emerald-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-blue-100 rounded-full">
          <BookOpen className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Education Center</h1>
          <p className="text-gray-600">Learn about sustainable living and environmental impact</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        ) : (
          filteredArticles.map(article => {
            const Icon = article.icon;
            return (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${getCategoryColor(article.category)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{article.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {article.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={getCategoryColor(article.category)}>
                        {categories.find(c => c.value === article.category)?.label}
                      </Badge>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Read More →
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Featured Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Leaf className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Did You Know?</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• India aims to achieve net-zero emissions by 2070</li>
                <li>• Solar energy costs have dropped by 90% in the last decade</li>
                <li>• One tree can offset 1 ton of CO₂ over its lifetime</li>
                <li>• LED bulbs use 80% less energy than traditional bulbs</li>
                <li>• Public transport reduces per-person emissions by 45%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Education;
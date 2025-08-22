import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { IndianRupee, Leaf, Trophy, TrendingUp, Sun, TreePine, Droplets, Car, Zap, BookOpen } from 'lucide-react';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';
import { calculationsAPI } from '../services/api';

const Dashboard = () => {
  const { user, userStats } = useAuth();
  const [recentCalculations, setRecentCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRecentCalculations();
  }, []);

  const loadRecentCalculations = async () => {
    try {
      const calculations = await calculationsAPI.getAll({ limit: 5 });
      setRecentCalculations(calculations);
    } catch (error) {
      console.error('Failed to load recent calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      solar: Sun,
      afforestation: TreePine,
      water: Droplets,
      transport: Car,
      electricity: Zap
    };
    return icons[type] || Sun;
  };

  const getTypeColor = (type) => {
    const colors = {
      solar: 'text-yellow-600 bg-yellow-100',
      afforestation: 'text-green-600 bg-green-100',
      water: 'text-blue-600 bg-blue-100',
      transport: 'text-purple-600 bg-purple-100',
      electricity: 'text-orange-600 bg-orange-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-48"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-green-100">Keep up the great work saving money and the planet</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Money Saved</CardTitle>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ₹{userStats.total_saved?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Your financial impact
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CO₂ Reduced</CardTitle>
            <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Leaf className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {userStats.total_co2_reduced?.toLocaleString('en-IN', { minimumFractionDigits: 1 }) || '0.0'} kg
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Your environmental impact
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Points Earned</CardTitle>
            <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
              <Trophy className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">
              {userStats.total_points?.toLocaleString('en-IN') || '0'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Keep earning more!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Link to="/solar">
          <Button className="h-20 w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-2 border-yellow-200 flex flex-col items-center justify-center space-y-2">
            <Sun className="h-6 w-6" />
            <span className="text-sm font-medium">Solar Calculator</span>
          </Button>
        </Link>
        <Link to="/afforestation">
          <Button className="h-20 w-full bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200 flex flex-col items-center justify-center space-y-2">
            <TreePine className="h-6 w-6" />
            <span className="text-sm font-medium">Afforestation</span>
          </Button>
        </Link>
        <Link to="/water">
          <Button className="h-20 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-200 flex flex-col items-center justify-center space-y-2">
            <Droplets className="h-6 w-6" />
            <span className="text-sm font-medium">Water Savings</span>
          </Button>
        </Link>
        <Link to="/transport">
          <Button className="h-20 w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-purple-200 flex flex-col items-center justify-center space-y-2">
            <Car className="h-6 w-6" />
            <span className="text-sm font-medium">Transport</span>
          </Button>
        </Link>
        <Link to="/electricity">
          <Button className="h-20 w-full bg-orange-50 hover:bg-orange-100 text-orange-700 border-2 border-orange-200 flex flex-col items-center justify-center space-y-2">
            <Zap className="h-6 w-6" />
            <span className="text-sm font-medium">Electricity</span>
          </Button>
        </Link>
        <Link to="/education">
          <Button className="h-20 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 flex flex-col items-center justify-center space-y-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-sm font-medium">Learn</span>
          </Button>
        </Link>
      </div>

      {/* Recent Calculations Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Calculations</CardTitle>
            <CardDescription>Your latest eco-friendly actions</CardDescription>
          </div>
          <Link to="/history">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCalculations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No calculations yet. Start by using one of the calculators above!</p>
              </div>
            ) : (
              recentCalculations.map((calc) => {
                const Icon = getTypeIcon(calc.type);
                return (
                  <div key={calc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getTypeColor(calc.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{calc.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(calc.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          ₹{calc.money_saved.toFixed(2)}
                        </Badge>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          {calc.co2_reduced.toFixed(1)} kg CO₂
                        </Badge>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                          {calc.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
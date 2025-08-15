import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Sun, 
  Droplets, 
  Car, 
  Zap,
  IndianRupee,
  Leaf,
  Calendar
} from 'lucide-react';
import { useAuth } from '../App';
import { useToast } from '../hooks/use-toast';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  const { calculations, deleteCalculation } = useAuth();
  const { toast } = useToast();

  const getTypeIcon = (type) => {
    const icons = {
      solar: Sun,
      water: Droplets,
      transport: Car,
      electricity: Zap
    };
    return icons[type] || Sun;
  };

  const getTypeColor = (type) => {
    const colors = {
      solar: 'text-yellow-600 bg-yellow-100',
      water: 'text-blue-600 bg-blue-100',
      transport: 'text-purple-600 bg-purple-100',
      electricity: 'text-orange-600 bg-orange-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const filteredCalculations = calculations.filter(calc => {
    const matchesSearch = calc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || calc.type === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'savings':
        return b.moneySaved - a.moneySaved;
      case 'co2':
        return b.co2Reduced - a.co2Reduced;
      case 'points':
        return b.points - a.points;
      default:
        return 0;
    }
  });

  const handleDelete = (id, title) => {
    deleteCalculation(id);
    toast({
      title: "Calculation deleted",
      description: `"${title}" has been removed from your history.`
    });
  };

  const totalStats = calculations.reduce((acc, calc) => ({
    moneySaved: acc.moneySaved + calc.moneySaved,
    co2Reduced: acc.co2Reduced + calc.co2Reduced,
    points: acc.points + calc.points
  }), { moneySaved: 0, co2Reduced: 0, points: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gray-100 rounded-full">
          <HistoryIcon className="h-8 w-8 text-gray-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">History</h1>
          <p className="text-gray-600">View and manage your eco-friendly actions</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-green-700">₹{totalStats.moneySaved.toFixed(2)}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CO₂ Reduced</p>
                <p className="text-2xl font-bold text-emerald-700">{totalStats.co2Reduced.toFixed(1)} kg</p>
              </div>
              <Leaf className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-amber-700">{totalStats.points}</p>
              </div>
              <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-bold">P</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search calculations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="electricity">Electricity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="savings">Sort by Savings</SelectItem>
                <SelectItem value="co2">Sort by CO₂</SelectItem>
                <SelectItem value="points">Sort by Points</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredCalculations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No calculations found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' 
                  ? "Try adjusting your search or filter criteria."
                  : "Start by using one of the calculators to track your eco-friendly actions."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCalculations.map((calc) => {
            const Icon = getTypeIcon(calc.type);
            return (
              <Card key={calc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${getTypeColor(calc.type)}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{calc.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(calc.date).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                          <span className="capitalize">• {calc.type}</span>
                        </div>
                        {/* Details */}
                        {calc.details && (
                          <div className="mt-2 text-sm text-gray-600">
                            {Object.entries(calc.details).map(([key, value]) => (
                              <span key={key} className="mr-4">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Stats */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            ₹{calc.moneySaved.toFixed(2)}
                          </Badge>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                            {calc.co2Reduced.toFixed(1)} kg CO₂
                          </Badge>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                            {calc.points} pts
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            toast({
                              title: "Edit feature coming soon",
                              description: "We're working on adding edit functionality."
                            });
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-600"
                          onClick={() => handleDelete(calc.id, calc.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
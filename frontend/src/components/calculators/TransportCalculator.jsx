import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Car, IndianRupee, Leaf, Save, Calculator } from 'lucide-react';
import { useAuth } from '../../App';
import { useToast } from '../../hooks/use-toast';
import { RATES } from '../../mock';
import { calculationsAPI, profilesAPI } from '../../services/api';

const TransportCalculator = () => {
  const [formData, setFormData] = useState({
    distance: '',
    frequency: 'daily',
    currentMode: '',
    alternateMode: '',
    profileName: ''
  });
  const [results, setResults] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [saving, setSaving] = useState(false);
  
  const { refreshStats } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await profilesAPI.getByType('transport');
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const transportModes = [
    { value: 'taxi', label: 'Taxi/Cab' },
    { value: 'car', label: 'Personal Car' },
    { value: 'metro', label: 'Metro/Subway' },
    { value: 'bus', label: 'Bus' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily (30 days)', multiplier: 30 },
    { value: 'weekly', label: 'Weekly (4 times)', multiplier: 4 },
    { value: 'monthly', label: 'Monthly (1 time)', multiplier: 1 }
  ];

  const calculateSavings = () => {
    const distance = parseFloat(formData.distance);
    const freq = frequencies.find(f => f.value === formData.frequency)?.multiplier || 1;
    
    if (!distance || !formData.currentMode || !formData.alternateMode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.currentMode === formData.alternateMode) {
      toast({
        title: "Same transport mode",
        description: "Please select different current and alternate modes.",
        variant: "destructive"
      });
      return;
    }

    const currentTransport = RATES.transport[formData.currentMode];
    const alternateTransport = RATES.transport[formData.alternateMode];
    
    // Monthly costs
    const currentCost = distance * currentTransport.cost * freq;
    const alternateCost = distance * alternateTransport.cost * freq;
    const moneySaved = currentCost - alternateCost;
    
    // Monthly CO₂ (convert from g to kg)
    const currentCO2 = (distance * currentTransport.co2 * freq) / 1000;
    const alternateCO2 = (distance * alternateTransport.co2 * freq) / 1000;
    const co2Reduced = currentCO2 - alternateCO2;
    
    // Calculate points
    const points = Math.round(Math.max(moneySaved, 0) + Math.max(co2Reduced, 0));

    setResults({
      distance,
      frequency: freq,
      currentCost,
      alternateCost,
      moneySaved: Math.max(moneySaved, 0),
      co2Reduced: Math.max(co2Reduced, 0),
      points
    });
  };

  const saveCalculation = () => {
    if (!results) return;
    
    const currentLabel = transportModes.find(t => t.value === formData.currentMode)?.label;
    const alternateLabel = transportModes.find(t => t.value === formData.alternateMode)?.label;
    
    addCalculation({
      type: 'transport',
      title: `${currentLabel} → ${alternateLabel}`,
      moneySaved: results.moneySaved,
      co2Reduced: results.co2Reduced,
      points: results.points,
      details: {
        distance: `${formData.distance}km`,
        frequency: formData.frequency,
        from: currentLabel,
        to: alternateLabel
      }
    });

    toast({
      title: "Calculation saved!",
      description: `Saved ₹${results.moneySaved.toFixed(2)} in transport savings.`
    });

    // Reset form
    setFormData({ distance: '', frequency: 'daily', currentMode: '', alternateMode: '', profileName: '' });
    setResults(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-purple-100 rounded-full">
          <Car className="h-8 w-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transport Savings Calculator</h1>
          <p className="text-gray-600">Calculate savings by switching transportation modes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Calculate Your Savings</span>
            </CardTitle>
            <CardDescription>
              Compare different transportation modes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Distance */}
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km) *</Label>
              <Input
                id="distance"
                type="number"
                placeholder="e.g., 15"
                min="0"
                step="0.1"
                value={formData.distance}
                onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                One-way distance per trip
              </p>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label>Travel Frequency *</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map(freq => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current Transport Mode */}
            <div className="space-y-2">
              <Label>Current Transport Mode *</Label>
              <Select value={formData.currentMode} onValueChange={(value) => setFormData(prev => ({ ...prev, currentMode: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select current mode" />
                </SelectTrigger>
                <SelectContent>
                  {transportModes.map(mode => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Alternate Transport Mode */}
            <div className="space-y-2">
              <Label>Switch to *</Label>
              <Select value={formData.alternateMode} onValueChange={(value) => setFormData(prev => ({ ...prev, alternateMode: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select alternate mode" />
                </SelectTrigger>
                <SelectContent>
                  {transportModes.map(mode => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateSavings} 
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Savings
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-700">Your Transport Impact</CardTitle>
              <CardDescription>Monthly savings and environmental benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <IndianRupee className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">
                    ₹{results.moneySaved.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">Money Saved/Month</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-emerald-700">
                    {results.co2Reduced.toFixed(1)} kg
                  </div>
                  <p className="text-sm text-gray-600">CO₂ Reduced/Month</p>
                </div>
              </div>

              {/* Cost Comparison */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Cost:</span>
                  <Badge variant="outline" className="text-red-700 border-red-200">
                    ₹{results.currentCost.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Cost:</span>
                  <Badge variant="outline" className="text-green-700 border-green-200">
                    ₹{results.alternateCost.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Points Earned:</span>
                  <Badge className="bg-amber-100 text-amber-800">{results.points} points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual Savings:</span>
                  <Badge variant="secondary">₹{(results.moneySaved * 12).toFixed(0)}</Badge>
                </div>
              </div>

              <Button 
                onClick={saveCalculation} 
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save to My Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Information Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Car className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Transport Cost Comparison (India)</h3>
              <div className="text-sm text-purple-700 space-y-1">
                <div className="flex justify-between">
                  <span>• Taxi/Cab:</span>
                  <span>₹18/km, 150g CO₂/km</span>
                </div>
                <div className="flex justify-between">
                  <span>• Personal Car:</span>
                  <span>₹8/km, 120g CO₂/km</span>
                </div>
                <div className="flex justify-between">
                  <span>• Metro:</span>
                  <span>₹2.5/km, 18g CO₂/km</span>
                </div>
                <div className="flex justify-between">
                  <span>• Bus:</span>
                  <span>₹1.5/km, 25g CO₂/km</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportCalculator;
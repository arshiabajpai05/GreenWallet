import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Zap, IndianRupee, Leaf, Save, Calculator } from 'lucide-react';
import { useAuth } from '../../App';
import { useToast } from '../../hooks/use-toast';
import { mockProfiles, RATES } from '../../mock';

const ElectricityCalculator = () => {
  const [formData, setFormData] = useState({
    appliance: '',
    hoursPerDay: '',
    daysPerMonth: '30',
    profileName: ''
  });
  const [results, setResults] = useState(null);
  const [profiles] = useState(mockProfiles.electricity);
  
  const { addCalculation } = useAuth();
  const { toast } = useToast();

  const appliances = [
    { value: 'ac_to_fan', label: 'Switch AC to Fan', fromPower: 1.5, toPower: 0.075 },
    { value: 'ac_reduce', label: 'Reduce AC Usage (50%)', fromPower: 1.5, toPower: 0.75 },
    { value: 'led_bulb', label: 'Switch to LED Bulbs', fromPower: 0.06, toPower: 0.01 },
    { value: 'energy_star', label: 'Energy Star Appliances', fromPower: 2.0, toPower: 1.4 }
  ];

  const calculateSavings = () => {
    const hoursPerDay = parseFloat(formData.hoursPerDay);
    const daysPerMonth = parseFloat(formData.daysPerMonth);
    
    if (!formData.appliance || !hoursPerDay || !daysPerMonth) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedAppliance = appliances.find(a => a.value === formData.appliance);
    if (!selectedAppliance) return;

    // Calculate monthly consumption difference (kWh)
    const fromConsumption = selectedAppliance.fromPower * hoursPerDay * daysPerMonth;
    const toConsumption = selectedAppliance.toPower * hoursPerDay * daysPerMonth;
    const kwhSaved = fromConsumption - toConsumption;
    
    // Calculate monthly savings (₹)
    const moneySaved = kwhSaved * RATES.electricity;
    
    // Calculate CO₂ reduction (kg)
    const co2Reduced = kwhSaved * RATES.electricityCO2;
    
    // Calculate points
    const points = Math.round(moneySaved + co2Reduced);

    setResults({
      kwhSaved,
      moneySaved,
      co2Reduced,
      points,
      fromConsumption,
      toConsumption
    });
  };

  const saveCalculation = () => {
    if (!results) return;
    
    const applianceLabel = appliances.find(a => a.value === formData.appliance)?.label;
    
    addCalculation({
      type: 'electricity',
      title: applianceLabel || 'Electricity Saving',
      moneySaved: results.moneySaved,
      co2Reduced: results.co2Reduced,
      points: results.points,
      details: {
        hoursPerDay: formData.hoursPerDay,
        daysPerMonth: formData.daysPerMonth,
        appliance: applianceLabel
      }
    });

    toast({
      title: "Calculation saved!",
      description: `Saved ₹${results.moneySaved.toFixed(2)} in electricity savings.`
    });

    // Reset form
    setFormData({ appliance: '', hoursPerDay: '', daysPerMonth: '30', profileName: '' });
    setResults(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-orange-100 rounded-full">
          <Zap className="h-8 w-8 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Electricity Savings Calculator</h1>
          <p className="text-gray-600">Calculate your electricity savings and environmental impact</p>
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
              Select an energy-saving action and enter usage details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Appliance/Action */}
            <div className="space-y-2">
              <Label>Energy Saving Action *</Label>
              <Select value={formData.appliance} onValueChange={(value) => setFormData(prev => ({ ...prev, appliance: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  {appliances.map(appliance => (
                    <SelectItem key={appliance.value} value={appliance.value}>
                      {appliance.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hours per day */}
            <div className="space-y-2">
              <Label htmlFor="hoursPerDay">Hours Used Per Day *</Label>
              <Input
                id="hoursPerDay"
                type="number"
                placeholder="e.g., 8"
                min="0"
                max="24"
                step="0.5"
                value={formData.hoursPerDay}
                onChange={(e) => setFormData(prev => ({ ...prev, hoursPerDay: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Average daily usage hours
              </p>
            </div>

            {/* Days per month */}
            <div className="space-y-2">
              <Label htmlFor="daysPerMonth">Days Per Month *</Label>
              <Input
                id="daysPerMonth"
                type="number"
                placeholder="e.g., 30"
                min="1"
                max="31"
                value={formData.daysPerMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, daysPerMonth: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                How many days per month do you use this?
              </p>
            </div>

            <Button 
              onClick={calculateSavings} 
              className="w-full bg-orange-600 hover:bg-orange-700"
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
              <CardTitle className="text-orange-700">Your Electricity Impact</CardTitle>
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
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-700">
                    {results.kwhSaved.toFixed(1)} kWh
                  </div>
                  <p className="text-sm text-gray-600">Energy Saved/Month</p>
                </div>
              </div>

              {/* Consumption Comparison */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Before:</span>
                  <Badge variant="outline" className="text-red-700 border-red-200">
                    {results.fromConsumption.toFixed(0)} kWh
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">After:</span>
                  <Badge variant="outline" className="text-green-700 border-green-200">
                    {results.toConsumption.toFixed(0)} kWh
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CO₂ Reduced:</span>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                    {results.co2Reduced.toFixed(1)} kg
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
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Zap className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Energy Saving Tips</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• AC uses 20x more power than ceiling fans</li>
                <li>• LED bulbs use 85% less energy than incandescent</li>
                <li>• Energy Star appliances can reduce consumption by 30%</li>
                <li>• Setting AC to 24°C instead of 18°C saves 24% energy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectricityCalculator;
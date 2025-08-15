import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Droplets, IndianRupee, Leaf, Save, Calculator } from 'lucide-react';
import { useAuth } from '../../App';
import { useToast } from '../../hooks/use-toast';
import { mockProfiles, RATES } from '../../mock';
import { profilesAPI } from '../../services/api';

const WaterCalculator = () => {
  const [calculationType, setCalculationType] = useState('bill');
  const [formData, setFormData] = useState({
    monthlyBill: '',
    litersPerMonth: '',
    action: 'rainwater',
    profileName: ''
  });
  const [results, setResults] = useState(null);
  const { refreshStats } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await profilesAPI.getByType('water');
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const waterActions = [
    { value: 'rainwater', label: 'Rainwater Harvesting', multiplier: 1.0 },
    { value: 'lowflow', label: 'Low-flow Fixtures', multiplier: 0.3 },
    { value: 'greywater', label: 'Greywater Recycling', multiplier: 0.4 },
    { value: 'drip', label: 'Drip Irrigation', multiplier: 0.5 },
    { value: 'leak', label: 'Fix Water Leaks', multiplier: 0.2 }
  ];

  const calculateSavings = () => {
    let liters = 0;
    let moneySaved = 0;
    
    if (calculationType === 'bill') {
      const monthlyBill = parseFloat(formData.monthlyBill);
      if (!monthlyBill) {
        toast({
          title: "Missing information",
          description: "Please enter your monthly water bill.",
          variant: "destructive"
        });
        return;
      }
      
      // Calculate liters from bill (₹30 per 1000L)
      liters = (monthlyBill / RATES.water) * 1000;
      moneySaved = monthlyBill * 0.3; // Assume 30% reduction
    } else {
      const inputLiters = parseFloat(formData.litersPerMonth);
      if (!inputLiters) {
        toast({
          title: "Missing information",
          description: "Please enter liters per month.",
          variant: "destructive"
        });
        return;
      }
      
      liters = inputLiters;
      const actionMultiplier = waterActions.find(a => a.value === formData.action)?.multiplier || 1.0;
      moneySaved = (liters / 1000) * RATES.water * actionMultiplier;
    }
    
    // Calculate CO₂ reduction
    const co2Reduced = (liters / 1000) * RATES.waterCO2;
    
    // Calculate points
    const points = Math.round(moneySaved + co2Reduced);

    setResults({
      litersPerMonth: liters,
      moneySaved,
      co2Reduced,
      points
    });
  };

  const saveCalculation = async () => {
    if (!results || saving) return;
    
    setSaving(true);
    try {
      const actionLabel = waterActions.find(a => a.value === formData.action)?.label || 'Water Saving';
      
      await calculationsAPI.create({
        type: 'water',
        title: calculationType === 'bill' ? 'Monthly Bill Reduction' : actionLabel,
        moneySaved: results.moneySaved,
        co2Reduced: results.co2Reduced,
        points: results.points,
        details: {
          litersPerMonth: `${results.litersPerMonth.toFixed(0)}L`,
          action: actionLabel
        }
      });

      await refreshStats();

      toast({
        title: "Calculation saved!",
        description: `Saved ₹${results.moneySaved.toFixed(2)} in water savings.`
      });

      // Reset form
      setFormData({ monthlyBill: '', litersPerMonth: '', action: 'rainwater', profileName: '' });
      setResults(null);
    } catch (error) {
      console.error('Failed to save calculation:', error);
      toast({
        title: "Error",
        description: "Failed to save calculation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-blue-100 rounded-full">
          <Droplets className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Water Savings Calculator</h1>
          <p className="text-gray-600">Calculate your water conservation savings and impact</p>
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
              Choose calculation method and enter your details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calculation Type */}
            <div className="space-y-2">
              <Label>Calculation Method</Label>
              <Select value={calculationType} onValueChange={setCalculationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bill">From Monthly Bill</SelectItem>
                  <SelectItem value="action">From Water Action</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {calculationType === 'bill' ? (
              <div className="space-y-2">
                <Label htmlFor="monthlyBill">Monthly Water Bill (₹) *</Label>
                <Input
                  id="monthlyBill"
                  type="number"
                  placeholder="e.g., 800"
                  min="0"
                  value={formData.monthlyBill}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyBill: e.target.value }))}
                />
                <p className="text-sm text-gray-500">
                  Average Indian household: ₹400-1200/month
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="litersPerMonth">Water Saved (Liters/Month) *</Label>
                  <Input
                    id="litersPerMonth"
                    type="number"
                    placeholder="e.g., 2500"
                    min="0"
                    value={formData.litersPerMonth}
                    onChange={(e) => setFormData(prev => ({ ...prev, litersPerMonth: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Water Saving Action *</Label>
                  <Select value={formData.action} onValueChange={(value) => setFormData(prev => ({ ...prev, action: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {waterActions.map(action => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button 
              onClick={calculateSavings} 
              className="w-full bg-blue-600 hover:bg-blue-700"
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
              <CardTitle className="text-blue-700">Your Water Impact</CardTitle>
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
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">
                    {results.litersPerMonth.toFixed(0)} L
                  </div>
                  <p className="text-sm text-gray-600">Water Saved/Month</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
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
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Droplets className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Water Conservation Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Rainwater harvesting can save 40-60% on bills</li>
                <li>• Low-flow fixtures reduce consumption by 30%</li>
                <li>• Fix leaks immediately - a dripping tap wastes 15L/day</li>
                <li>• Greywater recycling can cut usage by 30-40%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterCalculator;
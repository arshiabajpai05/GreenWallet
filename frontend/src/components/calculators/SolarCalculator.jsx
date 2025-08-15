import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Sun, IndianRupee, Leaf, Save, Calculator } from 'lucide-react';
import { useAuth } from '../../App';
import { useToast } from '../../hooks/use-toast';
import { mockProfiles, RATES } from '../../mock';

const SolarCalculator = () => {
  const [formData, setFormData] = useState({
    panelSize: '',
    sunlightHours: '',
    profileName: ''
  });
  const [results, setResults] = useState(null);
  const [showSaveProfile, setShowSaveProfile] = useState(false);
  const [profiles] = useState(mockProfiles.solar);
  
  const { addCalculation } = useAuth();
  const { toast } = useToast();

  const calculateSavings = () => {
    const panelSize = parseFloat(formData.panelSize);
    const sunlightHours = parseFloat(formData.sunlightHours);
    
    if (!panelSize || !sunlightHours) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Calculate monthly generation (kWh)
    const monthlyGeneration = panelSize * sunlightHours * 30; // 30 days
    
    // Calculate monthly savings (₹)
    const moneySaved = monthlyGeneration * RATES.electricity;
    
    // Calculate CO₂ reduction (kg)
    const co2Reduced = monthlyGeneration * RATES.electricityCO2;
    
    // Calculate points (1 point per ₹1 + 1 point per kg CO₂)
    const points = Math.round(moneySaved + co2Reduced);

    setResults({
      monthlyGeneration,
      moneySaved,
      co2Reduced,
      points
    });
  };

  const saveCalculation = () => {
    if (!results) return;
    
    addCalculation({
      type: 'solar',
      title: `Solar Panel (${formData.panelSize}kW)`,
      moneySaved: results.moneySaved,
      co2Reduced: results.co2Reduced,
      points: results.points,
      details: {
        panelSize: formData.panelSize + 'kW',
        sunlightHours: formData.sunlightHours,
        monthlyGeneration: results.monthlyGeneration.toFixed(0) + ' kWh'
      }
    });

    toast({
      title: "Calculation saved!",
      description: `Saved ₹${results.moneySaved.toFixed(2)} in solar savings.`
    });

    // Reset form
    setFormData({ panelSize: '', sunlightHours: '', profileName: '' });
    setResults(null);
  };

  const loadProfile = (profileId) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setFormData(prev => ({
        ...prev,
        panelSize: profile.panelSize.toString(),
        sunlightHours: profile.sunlightHours.toString()
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-yellow-100 rounded-full">
          <Sun className="h-8 w-8 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solar Savings Calculator</h1>
          <p className="text-gray-600">Calculate your solar panel savings and environmental impact</p>
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
              Enter your solar panel details to see potential savings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Load Profile */}
            <div className="space-y-2">
              <Label>Load Saved Profile (Optional)</Label>
              <Select onValueChange={loadProfile}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a saved setup" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map(profile => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name} ({profile.panelSize}kW, {profile.sunlightHours}h)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Panel Size */}
            <div className="space-y-2">
              <Label htmlFor="panelSize">Solar Panel Size (kW) *</Label>
              <Input
                id="panelSize"
                type="number"
                placeholder="e.g., 3"
                step="0.5"
                min="0"
                value={formData.panelSize}
                onChange={(e) => setFormData(prev => ({ ...prev, panelSize: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Typical home systems: 1-10 kW
              </p>
            </div>

            {/* Sunlight Hours */}
            <div className="space-y-2">
              <Label htmlFor="sunlightHours">Peak Sunlight Hours/Day *</Label>
              <Input
                id="sunlightHours"
                type="number"
                placeholder="e.g., 6"
                step="0.5"
                min="0"
                max="12"
                value={formData.sunlightHours}
                onChange={(e) => setFormData(prev => ({ ...prev, sunlightHours: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                India average: 4-8 hours (varies by location)
              </p>
            </div>

            <Button 
              onClick={calculateSavings} 
              className="w-full bg-yellow-600 hover:bg-yellow-700"
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
              <CardTitle className="text-green-700">Your Solar Impact</CardTitle>
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

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Generation:</span>
                  <Badge variant="outline">{results.monthlyGeneration.toFixed(0)} kWh</Badge>
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

              <div className="space-y-3">
                <Button 
                  onClick={saveCalculation} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save to My Account
                </Button>
                
                <Button 
                  onClick={() => setShowSaveProfile(!showSaveProfile)} 
                  variant="outline" 
                  className="w-full"
                >
                  Save as Profile
                </Button>
              </div>

              {/* Save Profile Form */}
              {showSaveProfile && (
                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                  <Label htmlFor="profileName">Profile Name</Label>
                  <Input
                    id="profileName"
                    placeholder="e.g., Home Solar Setup"
                    value={formData.profileName}
                    onChange={(e) => setFormData(prev => ({ ...prev, profileName: e.target.value }))}
                  />
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (formData.profileName) {
                        toast({
                          title: "Profile saved!",
                          description: `"${formData.profileName}" has been saved for future use.`
                        });
                        setShowSaveProfile(false);
                      }
                    }}
                  >
                    Save Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Information Card */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Sun className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Solar Power Benefits</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Reduce electricity bills by 70-90%</li>
                <li>• Government subsidies available up to 40%</li>
                <li>• 25-year warranty on most solar panels</li>
                <li>• Payback period: 3-5 years in India</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarCalculator;
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
import { calculationsAPI, profilesAPI } from '../../services/api';

const SolarCalculator = () => {
  const [formData, setFormData] = useState({
    monthlyBill: '',
    rooftopArea: '',
    sunlightHours: '',
    profileName: ''
  });
  const [results, setResults] = useState(null);
  const [showSaveProfile, setShowSaveProfile] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [saving, setSaving] = useState(false);
  
  const { refreshStats } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await profilesAPI.getByType('solar');
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const calculateSavings = () => {
    const monthlyBill = parseFloat(formData.monthlyBill);
    const rooftopArea = parseFloat(formData.rooftopArea);
    const sunlightHours = parseFloat(formData.sunlightHours);
    
    if (!monthlyBill || !rooftopArea || !sunlightHours) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // System Capacity (kW) = Rooftop Area × 0.01
    const systemCapacity = rooftopArea * 0.01;
    
    // Monthly Generation (kWh) = System Capacity × Sunlight Hours × 30 × 0.8
    const monthlyGeneration = systemCapacity * sunlightHours * 30 * 0.8;
    
    // Monthly Savings (₹) = Monthly Generation × 6
    const moneySaved = monthlyGeneration * 6;
    
    // Annual Savings (₹) = Monthly Savings × 12
    const annualSavings = moneySaved * 12;
    
    // Annual CO₂ Reduction (kg) = Monthly Generation × 12 × 0.82
    const annualCO2Reduction = monthlyGeneration * 12 * 0.82;
    
    // Points = Annual CO₂ Reduction × 10
    const points = Math.round(annualCO2Reduction * 10);
    
    setResults({
      systemCapacity,
      monthlyGeneration,
      moneySaved,
      annualSavings,
      annualCO2Reduction,
      points,
      monthlyBill
    });
  };

  const saveCalculation = async () => {
    if (!results) return;
    
    setSaving(true);
    try {
      await calculationsAPI.create({
        type: 'solar',
        title: `Solar Panel (${results.systemCapacity.toFixed(1)}kW)`,
        money_saved: results.moneySaved,
        co2_reduced: results.annualCO2Reduction / 12, // Monthly CO2 for consistency
        points: results.points,
        details: {
          system_capacity: results.systemCapacity.toFixed(1) + 'kW',
          rooftop_area: formData.rooftopArea + ' sqft',
          sunlight_hours: formData.sunlightHours,
          monthly_generation: results.monthlyGeneration.toFixed(0) + ' kWh'
        }
      });

      await refreshStats(); // Refresh user stats

      toast({
        title: "Calculation saved!",
        description: `Saved ₹${results.moneySaved.toFixed(2)} in solar savings.`
      });

      // Reset form
      setFormData({ monthlyBill: '', rooftopArea: '', sunlightHours: '', profileName: '' });
      setResults(null);
    } catch (error) {
      console.error('Failed to save calculation:', error);
      toast({
        title: "Save failed",
        description: "Failed to save calculation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!formData.profileName || !formData.rooftopArea || !formData.sunlightHours) {
      toast({
        title: "Missing information",
        description: "Please fill in profile name and calculator fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await profilesAPI.create({
        type: 'solar',
        name: formData.profileName,
        data: {
          monthly_bill: parseFloat(formData.monthlyBill),
          rooftop_area: parseFloat(formData.rooftopArea),
          sunlight_hours: parseFloat(formData.sunlightHours)
        }
      });

      await loadProfiles(); // Refresh profiles list

      toast({
        title: "Profile saved!",
        description: `"${formData.profileName}" has been saved for future use.`
      });

      setShowSaveProfile(false);
      setFormData(prev => ({ ...prev, profileName: '' }));
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Save failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadProfile = (profileId) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setFormData(prev => ({
        ...prev,
        monthlyBill: profile.data.monthly_bill?.toString() || '',
        rooftopArea: profile.data.rooftop_area.toString(),
        sunlightHours: profile.data.sunlight_hours.toString()
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
            {profiles.length > 0 && (
              <div className="space-y-2">
                <Label>Load Saved Profile (Optional)</Label>
                <Select onValueChange={loadProfile}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a saved setup" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map(profile => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name} ({profile.data.rooftop_area} sqft, {profile.data.sunlight_hours}h)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Monthly Bill */}
            <div className="space-y-2">
              <Label htmlFor="monthlyBill">Monthly Electricity Bill (₹) *</Label>
              <Input
                id="monthlyBill"
                type="number"
                placeholder="e.g., 2500"
                min="0"
                value={formData.monthlyBill}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyBill: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Your current monthly electricity bill
              </p>
            </div>

            {/* Rooftop Area */}
            <div className="space-y-2">
              <Label htmlFor="rooftopArea">Rooftop Area (sqft) *</Label>
              <Input
                id="rooftopArea"
                type="number"
                placeholder="e.g., 500"
                min="0"
                value={formData.rooftopArea}
                onChange={(e) => setFormData(prev => ({ ...prev, rooftopArea: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Available rooftop area for solar panels
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
              <CardDescription>System details and annual benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 gap-4">
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
                    {results.annualCO2Reduction.toFixed(1)} kg
                  </div>
                  <p className="text-sm text-gray-600">CO₂ Reduced/Year</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-amber-600 font-bold text-lg">P</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-700">
                    {results.points.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Points Earned</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">System Capacity:</span>
                  <Badge variant="outline">{results.systemCapacity.toFixed(1)} kW</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Generation:</span>
                  <Badge variant="outline">{results.monthlyGeneration.toFixed(0)} kWh</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual Savings:</span>
                  <Badge variant="secondary">₹{results.annualSavings.toFixed(0)}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={saveCalculation} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save to My Account'}
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
                    onClick={saveProfile}
                  >
                    Save Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Sun className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Tips for Maximizing Solar Savings</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Reduce electricity bills by 70-90%</li>
                <li>• Government subsidies available up to 40%</li>
                <li>• 25-year warranty on most solar panels</li>
                <li>• Payback period: 3-5 years in India</li>
                <li>• Clean panels monthly for optimal performance</li>
                <li>• South-facing roofs get maximum sunlight</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarCalculator;
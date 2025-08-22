import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { TreePine, Leaf, Award, Save, Calculator } from 'lucide-react';
import { useAuth } from '../../App';
import { useToast } from '../../hooks/use-toast';
import { calculationsAPI, profilesAPI } from '../../services/api';

const AfforestationCalculator = () => {
  const [formData, setFormData] = useState({
    numberOfTrees: '',
    landArea: '',
    yearsOfGrowth: '',
    treeSpecies: '',
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
      const data = await profilesAPI.getByType('afforestation');
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const treeSpecies = [
    { value: 'neem', label: 'Neem', multiplier: 1.0 },
    { value: 'banyan', label: 'Banyan', multiplier: 1.5 },
    { value: 'peepal', label: 'Peepal', multiplier: 1.3 },
    { value: 'mango', label: 'Mango', multiplier: 1.1 },
    { value: 'teak', label: 'Teak', multiplier: 1.2 },
    { value: 'eucalyptus', label: 'Eucalyptus', multiplier: 0.9 },
    { value: 'bamboo', label: 'Bamboo', multiplier: 0.8 },
    { value: 'oak', label: 'Oak', multiplier: 1.4 }
  ];

  const calculateImpact = () => {
    const numberOfTrees = parseFloat(formData.numberOfTrees);
    const landArea = parseFloat(formData.landArea);
    const yearsOfGrowth = parseFloat(formData.yearsOfGrowth);
    
    if (!numberOfTrees || !landArea || !yearsOfGrowth || !formData.treeSpecies) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedSpecies = treeSpecies.find(s => s.value === formData.treeSpecies);
    const speciesMultiplier = selectedSpecies?.multiplier || 1.0;

    // CO₂ Absorbed (kg) = Number of Trees × 22 × Years of Growth
    const co2Absorbed = numberOfTrees * 22 * yearsOfGrowth * speciesMultiplier;
    
    // Oxygen Produced (kg) = Number of Trees × 118 × Years of Growth
    const oxygenProduced = numberOfTrees * 118 * yearsOfGrowth * speciesMultiplier;
    
    // Points = CO₂ Absorbed × 5
    const points = Math.round(co2Absorbed * 5);
    
    // Biodiversity Score = Land Area × 0.1 × Number of Trees
    const biodiversityScore = landArea * 0.1 * numberOfTrees;
    
    // Soil Conservation (cubic ft) = Number of Trees × 2.5 × Years of Growth
    const soilConservation = numberOfTrees * 2.5 * yearsOfGrowth;

    setResults({
      co2Absorbed,
      oxygenProduced,
      points,
      biodiversityScore,
      soilConservation,
      speciesName: selectedSpecies?.label
    });
  };

  const saveCalculation = async () => {
    if (!results || saving) return;
    
    setSaving(true);
    try {
      await calculationsAPI.create({
        type: 'afforestation',
        title: `${formData.numberOfTrees} ${results.speciesName} Trees`,
        money_saved: 0, // No direct money savings for afforestation
        co2_reduced: results.co2Absorbed,
        points: results.points,
        details: {
          number_of_trees: formData.numberOfTrees,
          land_area: formData.landArea + ' sqft',
          years_of_growth: formData.yearsOfGrowth,
          tree_species: results.speciesName,
          oxygen_produced: results.oxygenProduced.toFixed(0) + ' kg'
        }
      });

      await refreshStats();

      toast({
        title: "Calculation saved!",
        description: `Saved ${results.co2Absorbed.toFixed(0)} kg CO₂ absorption impact.`
      });

      // Reset form
      setFormData({ numberOfTrees: '', landArea: '', yearsOfGrowth: '', treeSpecies: '', profileName: '' });
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

  const saveProfile = async () => {
    if (!formData.profileName || !formData.numberOfTrees || !formData.landArea) {
      toast({
        title: "Missing information",
        description: "Please fill in profile name and calculator fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await profilesAPI.create({
        type: 'afforestation',
        name: formData.profileName,
        data: {
          number_of_trees: parseFloat(formData.numberOfTrees),
          land_area: parseFloat(formData.landArea),
          years_of_growth: parseFloat(formData.yearsOfGrowth),
          tree_species: formData.treeSpecies
        }
      });

      await loadProfiles();

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
        numberOfTrees: profile.data.number_of_trees.toString(),
        landArea: profile.data.land_area.toString(),
        yearsOfGrowth: profile.data.years_of_growth?.toString() || '',
        treeSpecies: profile.data.tree_species || ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-green-100 rounded-full">
          <TreePine className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Afforestation Impact Calculator</h1>
          <p className="text-gray-600">Calculate the environmental impact of tree plantation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Calculate Environmental Impact</span>
            </CardTitle>
            <CardDescription>
              Enter your afforestation project details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Load Profile */}
            {profiles.length > 0 && (
              <div className="space-y-2">
                <Label>Load Saved Profile (Optional)</Label>
                <Select onValueChange={loadProfile}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a saved project" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map(profile => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name} ({profile.data.number_of_trees} trees, {profile.data.land_area} sqft)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Number of Trees */}
            <div className="space-y-2">
              <Label htmlFor="numberOfTrees">Number of Trees *</Label>
              <Input
                id="numberOfTrees"
                type="number"
                placeholder="e.g., 100"
                min="1"
                value={formData.numberOfTrees}
                onChange={(e) => setFormData(prev => ({ ...prev, numberOfTrees: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Total number of trees to be planted
              </p>
            </div>

            {/* Land Area */}
            <div className="space-y-2">
              <Label htmlFor="landArea">Land Area (sqft) *</Label>
              <Input
                id="landArea"
                type="number"
                placeholder="e.g., 5000"
                min="1"
                value={formData.landArea}
                onChange={(e) => setFormData(prev => ({ ...prev, landArea: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Total area available for plantation
              </p>
            </div>

            {/* Years of Growth */}
            <div className="space-y-2">
              <Label htmlFor="yearsOfGrowth">Years of Growth *</Label>
              <Input
                id="yearsOfGrowth"
                type="number"
                placeholder="e.g., 10"
                min="1"
                max="50"
                value={formData.yearsOfGrowth}
                onChange={(e) => setFormData(prev => ({ ...prev, yearsOfGrowth: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Expected years of tree growth
              </p>
            </div>

            {/* Tree Species */}
            <div className="space-y-2">
              <Label>Tree Species *</Label>
              <Select value={formData.treeSpecies} onValueChange={(value) => setFormData(prev => ({ ...prev, treeSpecies: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tree species" />
                </SelectTrigger>
                <SelectContent>
                  {treeSpecies.map(species => (
                    <SelectItem key={species.value} value={species.value}>
                      {species.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Different species have varying environmental impact
              </p>
            </div>

            <Button 
              onClick={calculateImpact} 
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Impact
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Environmental Impact</CardTitle>
              <CardDescription>Your afforestation project benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-emerald-700">
                    {results.co2Absorbed.toFixed(0)} kg
                  </div>
                  <p className="text-sm text-gray-600">CO₂ Absorbed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold text-sm">O₂</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {results.oxygenProduced.toFixed(0)} kg
                  </div>
                  <p className="text-sm text-gray-600">Oxygen Produced</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-700">
                    {results.points.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Points Earned</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tree Species:</span>
                  <Badge variant="outline">{results.speciesName}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Biodiversity Score:</span>
                  <Badge variant="outline">{results.biodiversityScore.toFixed(1)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Soil Conservation:</span>
                  <Badge variant="outline">{results.soilConservation.toFixed(0)} cu ft</Badge>
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
                    placeholder="e.g., Community Forest Project"
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
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <TreePine className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Best Practices for Tree Plantation</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Plant native species for better survival rates</li>
                <li>• Ensure adequate spacing between trees (6-10 feet)</li>
                <li>• Plant during monsoon season for natural watering</li>
                <li>• Regular maintenance for first 2-3 years is crucial</li>
                <li>• Mix of fruit and timber trees provides multiple benefits</li>
                <li>• Consider soil type and local climate conditions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AfforestationCalculator;
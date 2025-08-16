import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Building, 
  Users, 
  Mail, 
  QrCode,
  TrendingUp,
  Trophy,
  Download,
  UserPlus,
  IndianRupee,
  Leaf,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '../App';
import { useToast } from '../hooks/use-toast';

const Organization = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Mock organization data
  const [orgData, setOrgData] = useState({
    id: 'org1',
    name: 'Green Tech Solutions',
    type: 'company',
    description: 'Leading the way in sustainable technology',
    invite_code: 'GT2024XY',
    member_count: 45,
    admin_name: user?.name || 'Admin User'
  });

  const [orgStats, setOrgStats] = useState({
    total_members: 45,
    total_saved: 125000.50,
    total_co2_reduced: 3250.8,
    total_points: 15670,
    calculation_count: 189
  });

  const [members, setMembers] = useState([
    { id: '1', name: 'Rajesh Kumar', email: 'rajesh@company.com', points: 1250, savings: 8500, joined: '2024-01-15', role: 'member' },
    { id: '2', name: 'Priya Sharma', email: 'priya@company.com', points: 1680, savings: 12300, joined: '2024-01-20', role: 'member' },
    { id: '3', name: 'Amit Singh', email: 'amit@company.com', points: 945, savings: 6200, joined: '2024-02-01', role: 'member' },
    { id: '4', name: 'Sneha Patel', email: 'sneha@company.com', points: 1420, savings: 9800, joined: '2024-02-10', role: 'member' },
    { id: '5', name: 'Vikram Mehta', email: 'vikram@company.com', points: 1150, savings: 7800, joined: '2024-02-15', role: 'member' }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [activeChallenge, setActiveChallenge] = useState({
    title: 'March Water Conservation Challenge',
    description: 'Save water and win rewards!',
    goal: 50000,
    current: 32500,
    participants: 28,
    ends_at: '2024-03-31'
  });

  const topPerformers = members
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const handleInviteByEmail = () => {
    if (!inviteEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send invitation.",
        variant: "destructive"
      });
      return;
    }

    // In real implementation, this would call API
    toast({
      title: "Invitation sent!",
      description: `Invitation email sent to ${inviteEmail}`,
    });
    setInviteEmail('');
  };

  const generateQRCode = () => {
    // In real implementation, this would generate actual QR code
    toast({
      title: "QR Code generated",
      description: "QR code for organization invitation has been generated.",
    });
  };

  const exportReport = () => {
    // In real implementation, this would generate and download report
    toast({
      title: "Report generated",
      description: "Organization sustainability report is being prepared for download.",
    });
  };

  const challengeProgress = Math.round((activeChallenge.current / activeChallenge.goal) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <Building className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{orgData.name}</h1>
            <p className="text-gray-600">Organization Dashboard</p>
          </div>
        </div>
        <Button onClick={exportReport} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Organization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-blue-700">{orgStats.total_members}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-green-700">₹{orgStats.total_saved.toLocaleString('en-IN')}</p>
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
                <p className="text-2xl font-bold text-emerald-700">{orgStats.total_co2_reduced.toLocaleString('en-IN')} kg</p>
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
                <p className="text-2xl font-bold text-purple-700">{orgStats.total_points.toLocaleString('en-IN')}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="invite">Invite</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>🏆 Top Performers This Month</CardTitle>
              <CardDescription>Leading contributors to organization sustainability goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-amber-600' : 'bg-green-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">₹{member.savings.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-gray-600">{member.points} points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Members */}
          <Card>
            <CardHeader>
              <CardTitle>All Members ({members.length})</CardTitle>
              <CardDescription>Manage your organization members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-xs text-gray-500">Joined: {new Date(member.joined).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex space-x-2">
                        <Badge variant="secondary">₹{member.savings.toLocaleString('en-IN')}</Badge>
                        <Badge variant="secondary">{member.points} pts</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Active Challenge</CardTitle>
              <CardDescription>Current organization-wide sustainability challenge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{activeChallenge.title}</h3>
                <p className="text-gray-600">{activeChallenge.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-700">₹{activeChallenge.current.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-600">Current Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-700">{activeChallenge.participants}</p>
                  <p className="text-sm text-gray-600">Participants</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-700">{challengeProgress}%</p>
                  <p className="text-sm text-gray-600">Completion</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${challengeProgress}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Goal: ₹{activeChallenge.goal.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-600">Ends: {new Date(activeChallenge.ends_at).toLocaleDateString('en-IN')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invite Tab */}
        <TabsContent value="invite" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Invitation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Invitation</span>
                </CardTitle>
                <CardDescription>Send personalized email invitations to potential members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleInviteByEmail} className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </CardContent>
            </Card>

            {/* QR Code Invitation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5" />
                  <span>QR Code</span>
                </CardTitle>
                <CardDescription>Generate QR code for quick team registration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">QR Code will appear here</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Invite Code</p>
                  <p className="text-2xl font-bold text-green-700">{orgData.invite_code}</p>
                </div>
                <Button onClick={generateQRCode} className="w-full">
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Monthly Report</CardTitle>
                <CardDescription>Comprehensive monthly sustainability report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Period:</span>
                    <span className="font-medium">February 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Savings:</span>
                    <span className="font-medium text-green-700">₹32,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CO₂ Reduction:</span>
                    <span className="font-medium text-emerald-700">485 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Members:</span>
                    <span className="font-medium">38/45</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏢 ESG Report</CardTitle>
                <CardDescription>Environmental, Social & Governance impact report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>ESG Score:</span>
                    <span className="font-medium text-green-700">85/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Footprint:</span>
                    <span className="font-medium">-1.2 tons CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sustainability Rank:</span>
                    <span className="font-medium">Top 10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance:</span>
                    <span className="font-medium text-green-700">100%</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Generate ESG Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Organization;
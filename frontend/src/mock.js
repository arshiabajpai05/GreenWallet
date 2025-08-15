// Mock data for GreenWallet
export const mockUser = {
  id: '1',
  email: 'user@example.com',
  name: 'Raj Kumar',
  totalSaved: 16073.16,
  totalCO2Reduced: 2046.4,
  totalPoints: 3651,
  joinDate: '2024-01-15'
};

export const mockCalculations = [
  {
    id: '1',
    type: 'solar',
    date: '2024-07-15',
    title: 'Solar Panel Setup',
    moneySaved: 450.25,
    co2Reduced: 15.8,
    points: 85,
    details: {
      panelSize: '3kW',
      sunlightHours: 6,
      monthlyGeneration: '540 kWh'
    }
  },
  {
    id: '2',
    type: 'transport',
    date: '2024-07-14',
    title: 'Metro vs Taxi',
    moneySaved: 180.00,
    co2Reduced: 8.2,
    points: 45,
    details: {
      distance: '15km',
      frequency: 'Daily',
      from: 'Taxi',
      to: 'Metro'
    }
  },
  {
    id: '3',
    type: 'electricity',
    date: '2024-07-13',
    title: 'AC to Fan Switch',
    moneySaved: 315.75,
    co2Reduced: 12.4,
    points: 65,
    details: {
      hoursPerDay: 8,
      daysPerMonth: 30,
      appliance: 'AC to Fan'
    }
  },
  {
    id: '4',
    type: 'water',
    date: '2024-07-12',
    title: 'Rainwater Harvesting',
    moneySaved: 225.50,
    co2Reduced: 6.8,
    points: 55,
    details: {
      litersPerMonth: '2500L',
      action: 'Rainwater Collection'
    }
  }
];

export const mockProfiles = {
  solar: [
    { id: '1', name: 'Home Solar Setup', panelSize: '3kW', sunlightHours: 6 },
    { id: '2', name: 'Office Solar', panelSize: '5kW', sunlightHours: 7 }
  ],
  transport: [
    { id: '1', name: 'Daily Commute', distance: 15, currentMode: 'Taxi', alternateMode: 'Metro' },
    { id: '2', name: 'Weekend Travel', distance: 25, currentMode: 'Car', alternateMode: 'Bus' }
  ],
  electricity: [
    { id: '1', name: 'Bedroom AC', appliance: 'AC', hoursPerDay: 8 },
    { id: '2', name: 'Living Room', appliance: 'Fan', hoursPerDay: 12 }
  ],
  water: [
    { id: '1', name: 'Monthly Bill', monthlyBill: 800, action: 'Bill Reduction' },
    { id: '2', name: 'Rainwater Setup', litersPerMonth: 2500, action: 'Rainwater Harvesting' }
  ]
};

// Indian rates and factors
export const RATES = {
  electricity: 7, // ₹ per kWh
  electricityCO2: 0.82, // kg CO₂ per kWh
  water: 30, // ₹ per 1000 liters
  waterCO2: 1.6, // kg CO₂ per 1000 liters
  transport: {
    taxi: { cost: 18, co2: 150 }, // ₹ per km, g CO₂ per km
    metro: { cost: 2.5, co2: 18 }, // ₹ per km, g CO₂ per km
    bus: { cost: 1.5, co2: 25 },
    car: { cost: 8, co2: 120 }
  },
  appliances: {
    ac: 1.5, // kWh per hour
    fan: 0.075 // kWh per hour
  }
};

export const getIconByType = (type) => {
  const icons = {
    solar: 'Sun',
    water: 'Droplets',
    transport: 'Car',
    electricity: 'Zap'
  };
  return icons[type] || 'Circle';
};

export const getColorByType = (type) => {
  const colors = {
    solar: 'text-yellow-600',
    water: 'text-blue-600',
    transport: 'text-purple-600',
    electricity: 'text-orange-600'
  };
  return colors[type] || 'text-gray-600';
};
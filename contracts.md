# GreenWallet Backend Contracts

## API Endpoints to Implement

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### User Endpoints
```
GET /api/users/profile
PUT /api/users/profile
GET /api/users/stats
```

### Calculations Endpoints
```
POST /api/calculations
GET /api/calculations
PUT /api/calculations/:id
DELETE /api/calculations/:id
GET /api/calculations/stats
```

### Calculator Profiles Endpoints
```
POST /api/profiles
GET /api/profiles/:type
PUT /api/profiles/:id
DELETE /api/profiles/:id
```

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Calculation Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (enum: 'solar', 'water', 'transport', 'electricity'),
  title: String,
  moneySaved: Number,
  co2Reduced: Number,
  points: Number,
  details: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Profile Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (enum: 'solar', 'water', 'transport', 'electricity'),
  name: String,
  data: Object, // Contains type-specific fields
  createdAt: Date,
  updatedAt: Date
}
```

## Mock Data to Replace

### From mock.js:
1. **mockUser** → Replace with real user authentication and profile data
2. **mockCalculations** → Replace with database-stored calculations
3. **mockProfiles** → Replace with user-created profiles from database
4. **RATES** → Keep as constants (Indian rates for calculations)

## Frontend Integration Changes

### Authentication
- Replace mock login/register with API calls
- Add JWT token management
- Add protected route logic
- Handle authentication errors

### Dashboard
- Replace mockUser totals with API call to /api/users/stats
- Replace mockCalculations with API call to /api/calculations

### Calculators
- Keep calculation logic frontend (for real-time feedback)
- Add save functionality to POST /api/calculations
- Replace mockProfiles with API calls to /api/profiles

### History
- Replace local calculations array with API calls
- Implement real delete functionality
- Add edit functionality (PUT /api/calculations/:id)

## Authentication Flow
1. User registers/logs in → JWT token stored in localStorage
2. All API calls include Authorization header: `Bearer ${token}`
3. Backend verifies JWT on protected routes
4. Frontend redirects to login if token invalid

## Calculation Flow
1. User inputs data in calculator
2. Frontend calculates results immediately (for UX)
3. User clicks "Save" → POST /api/calculations with results
4. Update user stats → Recalculate totals
5. Refresh dashboard data

## Profile Management Flow
1. User creates calculator profile → POST /api/profiles
2. Load profiles dropdown → GET /api/profiles/:type
3. Edit/Delete profiles → PUT/DELETE /api/profiles/:id

## Error Handling
- 401 Unauthorized → Redirect to login
- 400 Bad Request → Show validation errors
- 500 Server Error → Show generic error message
- Network errors → Show retry option

## Backend Implementation Priority
1. ✅ Setup MongoDB models and validation
2. ✅ Implement authentication (register/login/JWT)
3. ✅ Implement calculations CRUD
4. ✅ Implement profiles CRUD  
5. ✅ Implement user stats aggregation
6. ✅ Replace frontend mock calls with real API calls
7. ✅ Add error handling and loading states

## Database Indexes
```javascript
// Users
{ email: 1 } // unique

// Calculations  
{ userId: 1, createdAt: -1 } // user's calculations by date
{ userId: 1, type: 1 } // user's calculations by type

// Profiles
{ userId: 1, type: 1 } // user's profiles by type
```
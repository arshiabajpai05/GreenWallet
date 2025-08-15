#!/usr/bin/env python3
"""
GreenWallet Backend API Test Suite
Tests all backend endpoints systematically
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Configuration
BASE_URL = "https://ecowallet-1.preview.emergentagent.com/api"
TEST_USER_EMAIL = f"testuser_{uuid.uuid4().hex[:8]}@greenwallet.com"
TEST_USER_PASSWORD = "SecurePass123!"
TEST_USER_NAME = "Green Test User"

class GreenWalletAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.access_token = None
        self.user_id = None
        self.test_calculation_id = None
        self.test_profile_id = None
        self.results = {
            "health_check": False,
            "auth_register": False,
            "auth_login": False,
            "auth_me": False,
            "user_stats": False,
            "calculation_create": False,
            "calculation_get": False,
            "calculation_update": False,
            "calculation_delete": False,
            "profile_create": False,
            "profile_get": False,
            "profile_delete": False
        }
        
    def log(self, message):
        """Log test messages with timestamp"""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")
        
    def test_health_check(self):
        """Test API health check endpoint"""
        self.log("Testing API Health Check...")
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "GreenWallet API" in data["message"]:
                    self.log("✅ Health check passed")
                    self.results["health_check"] = True
                    return True
                else:
                    self.log(f"❌ Health check failed - unexpected response: {data}")
            else:
                self.log(f"❌ Health check failed - status: {response.status_code}")
        except Exception as e:
            self.log(f"❌ Health check failed - error: {str(e)}")
        return False
        
    def test_auth_register(self):
        """Test user registration"""
        self.log("Testing User Registration...")
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
                "name": TEST_USER_NAME
            }
            response = requests.post(f"{self.base_url}/auth/register", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.access_token = data["access_token"]
                    # Handle both _id and id fields
                    self.user_id = data["user"].get("id") or data["user"].get("_id")
                    self.log("✅ User registration successful")
                    self.results["auth_register"] = True
                    return True
                else:
                    self.log(f"❌ Registration failed - missing fields: {data}")
            else:
                self.log(f"❌ Registration failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Registration failed - error: {str(e)}")
        return False
        
    def test_auth_login(self):
        """Test user login"""
        self.log("Testing User Login...")
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            response = requests.post(f"{self.base_url}/auth/login", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    # Update token in case it's different
                    self.access_token = data["access_token"]
                    self.log("✅ User login successful")
                    self.results["auth_login"] = True
                    return True
                else:
                    self.log(f"❌ Login failed - missing fields: {data}")
            else:
                self.log(f"❌ Login failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Login failed - error: {str(e)}")
        return False
        
    def test_auth_me(self):
        """Test get current user endpoint"""
        self.log("Testing Get Current User...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(f"{self.base_url}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "email" in data and data["email"] == TEST_USER_EMAIL:
                    self.log("✅ Get current user successful")
                    self.results["auth_me"] = True
                    return True
                else:
                    self.log(f"❌ Get current user failed - unexpected data: {data}")
            else:
                self.log(f"❌ Get current user failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Get current user failed - error: {str(e)}")
        return False
        
    def test_user_stats(self):
        """Test get user stats endpoint"""
        self.log("Testing Get User Stats...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(f"{self.base_url}/users/stats", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_saved", "total_co2_reduced", "total_points", "calculation_count"]
                if all(field in data for field in required_fields):
                    self.log("✅ Get user stats successful")
                    self.results["user_stats"] = True
                    return True
                else:
                    self.log(f"❌ Get user stats failed - missing fields: {data}")
            else:
                self.log(f"❌ Get user stats failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Get user stats failed - error: {str(e)}")
        return False
        
    def test_calculation_create(self):
        """Test create calculation endpoint"""
        self.log("Testing Create Calculation...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            payload = {
                "type": "solar",
                "title": "Test Solar Panel Installation",
                "money_saved": 450.75,
                "co2_reduced": 15.8,
                "points": 85,
                "details": {
                    "panel_size": "3kW",
                    "sunlight_hours": 6,
                    "monthly_generation": "540 kWh"
                }
            }
            response = requests.post(f"{self.base_url}/calculations", json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["title"] == payload["title"]:
                    self.test_calculation_id = data["id"]
                    self.log("✅ Create calculation successful")
                    self.results["calculation_create"] = True
                    return True
                else:
                    self.log(f"❌ Create calculation failed - unexpected data: {data}")
            else:
                self.log(f"❌ Create calculation failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Create calculation failed - error: {str(e)}")
        return False
        
    def test_calculation_get(self):
        """Test get calculations endpoint"""
        self.log("Testing Get Calculations...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(f"{self.base_url}/calculations", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check if our test calculation is in the list
                    found = any(calc["id"] == self.test_calculation_id for calc in data)
                    if found:
                        self.log("✅ Get calculations successful")
                        self.results["calculation_get"] = True
                        return True
                    else:
                        self.log(f"❌ Get calculations failed - test calculation not found")
                else:
                    self.log(f"❌ Get calculations failed - unexpected data: {data}")
            else:
                self.log(f"❌ Get calculations failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Get calculations failed - error: {str(e)}")
        return False
        
    def test_calculation_update(self):
        """Test update calculation endpoint"""
        self.log("Testing Update Calculation...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            payload = {
                "title": "Updated Solar Panel Installation",
                "money_saved": 500.00,
                "points": 95
            }
            response = requests.put(f"{self.base_url}/calculations/{self.test_calculation_id}", 
                                  json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data["title"] == payload["title"] and data["money_saved"] == payload["money_saved"]:
                    self.log("✅ Update calculation successful")
                    self.results["calculation_update"] = True
                    return True
                else:
                    self.log(f"❌ Update calculation failed - data not updated: {data}")
            else:
                self.log(f"❌ Update calculation failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Update calculation failed - error: {str(e)}")
        return False
        
    def test_profile_create(self):
        """Test create profile endpoint"""
        self.log("Testing Create Profile...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            payload = {
                "type": "solar",
                "name": "Test Home Solar Setup",
                "data": {
                    "panel_size": 3,
                    "sunlight_hours": 6,
                    "roof_area": 50
                }
            }
            response = requests.post(f"{self.base_url}/profiles", json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["name"] == payload["name"]:
                    self.test_profile_id = data["id"]
                    self.log("✅ Create profile successful")
                    self.results["profile_create"] = True
                    return True
                else:
                    self.log(f"❌ Create profile failed - unexpected data: {data}")
            else:
                self.log(f"❌ Create profile failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Create profile failed - error: {str(e)}")
        return False
        
    def test_profile_get(self):
        """Test get profiles endpoint"""
        self.log("Testing Get Profiles...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(f"{self.base_url}/profiles/solar", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check if our test profile is in the list
                    found = any(profile["id"] == self.test_profile_id for profile in data)
                    if found:
                        self.log("✅ Get profiles successful")
                        self.results["profile_get"] = True
                        return True
                    else:
                        self.log(f"❌ Get profiles failed - test profile not found")
                else:
                    self.log(f"❌ Get profiles failed - unexpected data: {data}")
            else:
                self.log(f"❌ Get profiles failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Get profiles failed - error: {str(e)}")
        return False
        
    def test_calculation_delete(self):
        """Test delete calculation endpoint"""
        self.log("Testing Delete Calculation...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.delete(f"{self.base_url}/calculations/{self.test_calculation_id}", 
                                     headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "deleted" in data["message"].lower():
                    self.log("✅ Delete calculation successful")
                    self.results["calculation_delete"] = True
                    return True
                else:
                    self.log(f"❌ Delete calculation failed - unexpected response: {data}")
            else:
                self.log(f"❌ Delete calculation failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Delete calculation failed - error: {str(e)}")
        return False
        
    def test_profile_delete(self):
        """Test delete profile endpoint"""
        self.log("Testing Delete Profile...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.delete(f"{self.base_url}/profiles/{self.test_profile_id}", 
                                     headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "deleted" in data["message"].lower():
                    self.log("✅ Delete profile successful")
                    self.results["profile_delete"] = True
                    return True
                else:
                    self.log(f"❌ Delete profile failed - unexpected response: {data}")
            else:
                self.log(f"❌ Delete profile failed - status: {response.status_code}, response: {response.text}")
        except Exception as e:
            self.log(f"❌ Delete profile failed - error: {str(e)}")
        return False
        
    def run_all_tests(self):
        """Run all tests in sequence"""
        self.log(f"Starting GreenWallet API Tests against {self.base_url}")
        self.log("=" * 60)
        
        # Test sequence - order matters for authentication flow
        tests = [
            ("Health Check", self.test_health_check),
            ("User Registration", self.test_auth_register),
            ("User Login", self.test_auth_login),
            ("Get Current User", self.test_auth_me),
            ("Get User Stats", self.test_user_stats),
            ("Create Calculation", self.test_calculation_create),
            ("Get Calculations", self.test_calculation_get),
            ("Update Calculation", self.test_calculation_update),
            ("Create Profile", self.test_profile_create),
            ("Get Profiles", self.test_profile_get),
            ("Delete Calculation", self.test_calculation_delete),
            ("Delete Profile", self.test_profile_delete),
        ]
        
        for test_name, test_func in tests:
            try:
                test_func()
            except Exception as e:
                self.log(f"❌ {test_name} failed with exception: {str(e)}")
            self.log("-" * 40)
            
        # Print summary
        self.print_summary()
        
    def print_summary(self):
        """Print test results summary"""
        self.log("=" * 60)
        self.log("TEST RESULTS SUMMARY")
        self.log("=" * 60)
        
        passed = sum(1 for result in self.results.values() if result)
        total = len(self.results)
        
        for test_name, result in self.results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            self.log(f"{test_name.replace('_', ' ').title()}: {status}")
            
        self.log("-" * 60)
        self.log(f"OVERALL: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
        
        if passed == total:
            self.log("🎉 All tests passed! GreenWallet API is working correctly.")
            return True
        else:
            self.log("⚠️  Some tests failed. Check the logs above for details.")
            return False

def main():
    """Main function to run the tests"""
    tester = GreenWalletAPITester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
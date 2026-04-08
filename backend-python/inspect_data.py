"""
Data Inspector for FoodSaver AI
Run this script to view current database contents
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def print_section(title):
    """Print a formatted section header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def check_server():
    """Check if server is running"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Server is running!")
            return True
    except:
        print("❌ Server is not running. Start it with: python main-complete.py")
        return False

def get_all_items():
    """Get all items (requires userId)"""
    print_section("📦 ITEMS DATABASE")
    
    # Try to get items for a test user
    test_user_id = input("Enter userId (or press Enter to skip): ").strip()
    
    if test_user_id:
        try:
            response = requests.get(f"{BASE_URL}/users/{test_user_id}/items")
            items = response.json()
            
            if items:
                print(f"\n📊 Found {len(items)} items:\n")
                for i, item in enumerate(items, 1):
                    print(f"{i}. {item.get('name')} ({item.get('category')})")
                    print(f"   Status: {item.get('status')}")
                    print(f"   Storage: {item.get('storage_condition')}")
                    print(f"   Expiry: {item.get('expiry_date')}")
                    print(f"   Days until expiry: {item.get('days_until_expiry')}")
                    print()
            else:
                print("📭 No items found for this user")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    else:
        print("⏭️  Skipped items inspection")

def test_registration():
    """Test user registration"""
    print_section("👤 TEST USER REGISTRATION")
    
    test = input("Create a test user? (y/n): ").strip().lower()
    
    if test == 'y':
        username = input("Username: ").strip() or f"testuser_{datetime.now().strftime('%H%M%S')}"
        password = input("Password: ").strip() or "test123"
        
        try:
            response = requests.post(
                f"{BASE_URL}/auth/register",
                json={"username": username, "password": password}
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"\n✅ User created successfully!")
                print(f"   Username: {data.get('username')}")
                print(f"   User ID: {data.get('userId')}")
                print(f"\n💡 Save this User ID to create items!")
                return data.get('userId')
            else:
                print(f"❌ Error: {response.json().get('detail')}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    return None

def test_login():
    """Test user login"""
    print_section("🔐 TEST USER LOGIN")
    
    test = input("Test login? (y/n): ").strip().lower()
    
    if test == 'y':
        username = input("Username: ").strip()
        password = input("Password: ").strip()
        
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login",
                json={"username": username, "password": password}
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"\n✅ Login successful!")
                print(f"   Username: {data.get('username')}")
                print(f"   User ID: {data.get('userId')}")
                return data.get('userId')
            else:
                print(f"❌ Error: {response.json().get('detail')}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    return None

def create_test_item(user_id):
    """Create a test item"""
    print_section("🍎 CREATE TEST ITEM")
    
    if not user_id:
        user_id = input("Enter userId: ").strip()
    
    if user_id:
        test = input("Create a test item? (y/n): ").strip().lower()
        
        if test == 'y':
            name = input("Item name (default: Apple): ").strip() or "Apple"
            category = input("Category (default: Fruit): ").strip() or "Fruit"
            storage = input("Storage (fridge/freezer/pantry, default: fridge): ").strip() or "fridge"
            
            try:
                response = requests.post(
                    f"{BASE_URL}/users/{user_id}/items",
                    json={
                        "name": name,
                        "category": category,
                        "storage_condition": storage,
                        "opened": False
                    }
                )
                
                if response.status_code == 200:
                    item = response.json()
                    print(f"\n✅ Item created successfully!")
                    print(f"   Name: {item.get('name')}")
                    print(f"   Category: {item.get('category')}")
                    print(f"   Status: {item.get('status')}")
                    print(f"   Expiry Date: {item.get('expiry_date')}")
                    print(f"   Days until expiry: {item.get('days_until_expiry')}")
                else:
                    print(f"❌ Error: {response.json()}")
            except Exception as e:
                print(f"❌ Error: {e}")

def get_analytics(user_id):
    """Get user analytics"""
    print_section("📊 USER ANALYTICS")
    
    if not user_id:
        user_id = input("Enter userId: ").strip()
    
    if user_id:
        try:
            response = requests.get(f"{BASE_URL}/analytics/{user_id}")
            
            if response.status_code == 200:
                analytics = response.json()
                print(f"\n📈 Analytics for user {user_id}:")
                print(f"   Total Items: {analytics.get('total_items')}")
                print(f"   Fresh Items: {analytics.get('fresh_items')}")
                print(f"   Expiring Soon: {analytics.get('expiring_soon')}")
                print(f"   Expired Items: {analytics.get('expired_items')}")
                print(f"   Consumed Items: {analytics.get('consumed_items')}")
            else:
                print(f"❌ Error: {response.json()}")
        except Exception as e:
            print(f"❌ Error: {e}")

def main():
    """Main function"""
    print("\n" + "🌱"*30)
    print("  FoodSaver AI - Data Inspector")
    print("🌱"*30)
    
    if not check_server():
        return
    
    user_id = None
    
    while True:
        print("\n" + "-"*60)
        print("What would you like to do?")
        print("-"*60)
        print("1. Register new user")
        print("2. Login existing user")
        print("3. View items")
        print("4. Create test item")
        print("5. View analytics")
        print("6. Exit")
        print("-"*60)
        
        choice = input("\nEnter choice (1-6): ").strip()
        
        if choice == '1':
            user_id = test_registration()
        elif choice == '2':
            user_id = test_login()
        elif choice == '3':
            get_all_items()
        elif choice == '4':
            create_test_item(user_id)
        elif choice == '5':
            get_analytics(user_id)
        elif choice == '6':
            print("\n👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice")

if __name__ == "__main__":
    main()

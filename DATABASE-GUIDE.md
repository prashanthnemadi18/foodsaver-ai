# 📊 Database Guide - FoodSaver AI

## 🗄️ Database Type

This project uses **IN-MEMORY STORAGE** (Python dictionaries) instead of a traditional database.

### Current Implementation:
```python
users_db = {}  # Stores user accounts
items_db = {}  # Stores food items
```

⚠️ **Important**: Data is stored in RAM and will be **lost when the server restarts**. This is perfect for development and testing but not for production.

---

## 📚 Database Structure

### 1. **users_db** - User Accounts
```python
users_db = {
    "username1": {
        "password": "password123",  # ⚠️ Not hashed (use bcrypt in production)
        "userId": "uuid-string-here"
    },
    "username2": {
        "password": "password456",
        "userId": "another-uuid"
    }
}
```

**Structure:**
- **Key**: Username (string)
- **Value**: Dictionary with password and userId

### 2. **items_db** - Food Items
```python
items_db = {
    "item-uuid-1": {
        "id": "item-uuid-1",
        "userId": "user-uuid",
        "name": "Milk",
        "category": "Dairy",
        "storage_condition": "fridge",
        "opened": False,
        "purchase_date": "2026-03-17",
        "createdAt": "2026-03-17T10:30:00",
        "expiry_date": "2026-03-24",
        "days_until_expiry": 7,
        "status": "Fresh"
    },
    "item-uuid-2": {
        "id": "item-uuid-2",
        "userId": "user-uuid",
        "name": "Bread",
        "category": "Bakery",
        "storage_condition": "pantry",
        "opened": True,
        "purchase_date": "2026-03-15",
        "createdAt": "2026-03-15T08:00:00",
        "expiry_date": "2026-03-18",
        "days_until_expiry": 1,
        "status": "Expiring Soon"
    }
}
```

**Structure:**
- **Key**: Item ID (UUID string)
- **Value**: Dictionary with all item details

---

## 🔍 How to Read Data

### Method 1: Direct Access (Python Backend)

#### Read All Users:
```python
# Get all usernames
all_users = list(users_db.keys())
print(all_users)  # ['john', 'jane', 'bob']

# Get specific user
user = users_db.get("john")
print(user)  # {'password': 'pass123', 'userId': 'uuid-here'}
```

#### Read All Items:
```python
# Get all items
all_items = list(items_db.values())
print(all_items)

# Get specific item by ID
item = items_db.get("item-uuid-1")
print(item)

# Get items for specific user
user_id = "some-user-uuid"
user_items = [item for item in items_db.values() if item.get("userId") == user_id]
print(user_items)
```

#### Count Data:
```python
# Count users
total_users = len(users_db)
print(f"Total users: {total_users}")

# Count items
total_items = len(items_db)
print(f"Total items: {total_items}")

# Count items per user
user_id = "some-user-uuid"
user_item_count = sum(1 for item in items_db.values() if item.get("userId") == user_id)
print(f"User has {user_item_count} items")
```

---

### Method 2: Via API Endpoints

#### Get All Items for a User:
```bash
# Using curl
curl http://localhost:8000/users/{userId}/items

# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:8000/users/{userId}/items" -UseBasicParsing
```

#### Get Analytics:
```bash
curl http://localhost:8000/analytics/{userId}
```

---

### Method 3: Interactive Python Shell

You can read data directly while the server is running:

```bash
# Open Python shell
python

# Import the running app (if you modify main-complete.py to export variables)
from main-complete import users_db, items_db

# Read data
print(users_db)
print(items_db)
```

---

### Method 4: Add Debug Endpoint (Recommended)

Add this to `main-complete.py` for easy data inspection:

```python
@app.get("/debug/data")
async def get_debug_data():
    """Debug endpoint to view all data"""
    return {
        "users_count": len(users_db),
        "items_count": len(items_db),
        "users": list(users_db.keys()),  # Only show usernames, not passwords
        "items": list(items_db.values())
    }
```

Then access: `http://localhost:8000/debug/data`

---

## 📝 How to Write/Modify Data

### Create User:
```python
import uuid

username = "newuser"
users_db[username] = {
    "password": "password123",
    "userId": str(uuid.uuid4())
}
```

### Create Item:
```python
import uuid
from datetime import datetime

item_id = str(uuid.uuid4())
items_db[item_id] = {
    "id": item_id,
    "userId": "user-uuid-here",
    "name": "Apple",
    "category": "Fruit",
    "storage_condition": "fridge",
    "opened": False,
    "purchase_date": datetime.now().date().isoformat(),
    "createdAt": datetime.now().isoformat(),
    "status": "Fresh"
}
```

### Update Item:
```python
item_id = "existing-item-uuid"
if item_id in items_db:
    items_db[item_id]["status"] = "Consumed"
```

### Delete Item:
```python
item_id = "item-to-delete"
if item_id in items_db:
    del items_db[item_id]
```

---

## 🔄 Upgrade to Real Database

To use a real database (PostgreSQL, MongoDB, SQLite), you would:

### Option 1: SQLite (Easiest)
```python
import sqlite3

# Create connection
conn = sqlite3.connect('foodsaver.db')

# Create tables
conn.execute('''
    CREATE TABLE users (
        username TEXT PRIMARY KEY,
        password TEXT,
        userId TEXT
    )
''')

conn.execute('''
    CREATE TABLE items (
        id TEXT PRIMARY KEY,
        userId TEXT,
        name TEXT,
        category TEXT,
        status TEXT,
        purchase_date TEXT
    )
''')
```

### Option 2: PostgreSQL (Production)
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/foodsaver"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
```

### Option 3: MongoDB (NoSQL)
```python
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['foodsaver']
users_collection = db['users']
items_collection = db['items']
```

---

## 🎯 Quick Data Inspection Commands

### While Server is Running:

1. **Check Health:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **View API Docs:**
   Open: `http://localhost:8000/docs`

3. **Test User Registration:**
   ```bash
   curl -X POST http://localhost:8000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"test123"}'
   ```

4. **Get User Items:**
   ```bash
   curl http://localhost:8000/users/{userId}/items
   ```

---

## 💡 Tips

1. **Data Persistence**: Current setup loses data on restart. Use a real database for production.
2. **Security**: Passwords are stored in plain text. Use bcrypt or similar in production.
3. **Scalability**: In-memory storage is fast but limited by RAM.
4. **Debugging**: Add print statements to see data changes in real-time.
5. **Testing**: Perfect for development - clean slate on every restart.

---

## 📞 Need Help?

- Check API docs: `http://localhost:8000/docs`
- View code: `backend-python/main-complete.py`
- Test endpoints: Use Swagger UI at `/docs`

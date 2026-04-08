# 🔍 Quick Guide: How to Read Data in FoodSaver AI

## 📊 Database Type

**IN-MEMORY STORAGE** - Data stored in Python dictionaries (RAM)

```python
users_db = {}  # User accounts
items_db = {}  # Food items
```

⚠️ **Data is lost when server restarts** - Perfect for testing!

---

## 🚀 3 Easy Ways to Read Data

### Method 1: Use the Data Inspector Script (Easiest!)

```bash
# Make sure server is running first
cd backend-python
python inspect_data.py
```

This interactive tool lets you:
- ✅ Register users
- ✅ Login users  
- ✅ View all items
- ✅ Create test items
- ✅ View analytics

---

### Method 2: Use API Endpoints

#### View API Documentation:
Open in browser: `http://localhost:8000/docs`

#### Get Items for a User:
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:8000/users/{userId}/items" -UseBasicParsing

# Or use browser
http://localhost:8000/users/{userId}/items
```

#### Get User Analytics:
```bash
http://localhost:8000/analytics/{userId}
```

---

### Method 3: Add Debug Code

Add this to `backend-python/main-complete.py`:

```python
@app.get("/debug/all-data")
async def debug_data():
    """View all database contents"""
    return {
        "total_users": len(users_db),
        "total_items": len(items_db),
        "usernames": list(users_db.keys()),
        "all_items": list(items_db.values())
    }
```

Then visit: `http://localhost:8000/debug/all-data`

---

## 📝 Database Structure

### Users Database:
```python
{
    "john": {
        "password": "pass123",
        "userId": "uuid-here"
    }
}
```

### Items Database:
```python
{
    "item-uuid": {
        "id": "item-uuid",
        "userId": "user-uuid",
        "name": "Milk",
        "category": "Dairy",
        "status": "Fresh",
        "expiry_date": "2026-03-24",
        "days_until_expiry": 7
    }
}
```

---

## 🎯 Quick Test

1. **Start Server:**
   ```bash
   cd backend-python
   python main-complete.py
   ```

2. **Run Inspector:**
   ```bash
   # In another terminal
   cd backend-python
   python inspect_data.py
   ```

3. **Follow the prompts to:**
   - Register a user
   - Create items
   - View data

---

## 💡 Pro Tips

- Data resets on server restart (clean slate every time)
- Use the Swagger UI at `/docs` for interactive API testing
- Check `DATABASE-GUIDE.md` for detailed information
- Current setup is perfect for development and testing

---

## 📚 More Information

- **Full Guide**: See `DATABASE-GUIDE.md`
- **API Docs**: `http://localhost:8000/docs`
- **Code**: `backend-python/main-complete.py`

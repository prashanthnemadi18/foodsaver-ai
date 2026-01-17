from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Dict, Any
from ..models.schemas import Item, ItemCreate, ItemUpdate
from ..services.firestore import FirestoreService
from ..services.ml import PredictionService

router = APIRouter()


def get_db() -> FirestoreService:
    # Lazy initialization to avoid import-time failures when Firestore is not available
    return FirestoreService()


# Simple in-memory fallback storage for local dev when Firestore/emulator is unavailable
_INMEM_DB: Dict[str, Dict[str, Any]] = {}


def get_ml() -> PredictionService:
    return PredictionService()


@router.get("/users/{user_id}/items", response_model=List[Item])
async def list_items(user_id: str) -> List[Item]:
    try:
        db = get_db()
        return await db.list_items(user_id)
    except Exception:
        # Graceful fallback in local dev if Firestore/emulator isn't running
        user_items = _INMEM_DB.get(user_id, {})
        items: List[Item] = []
        for iid, data in user_items.items():
            data_with_id = dict(data)
            data_with_id["id"] = iid
            items.append(Item(**data_with_id))
        return items


@router.post("/classify-image")
async def classify_image(file: UploadFile = File(...)) -> dict:
    """Lightweight demo endpoint: suggests name/category from the image filename
    and returns an expiry/status using the existing PredictionService.

    This is a stub for local development. Replace with a real vision model later.
    """
    try:
        filename = (file.filename or "").lower()
        # Very naive heuristics by filename keywords
        guess_map = {
            "apple": ("Apple", "fruits"),
            "banana": ("Banana", "fruits"),
            "milk": ("Milk", "dairy"),
            "bread": ("Bread", "bakery"),
            "tomato": ("Tomato", "vegetable"),
            "tomatoe": ("Tomato", "vegetable"),
            "carrot": ("Carrot", "vegetable"),
            "chicken": ("Chicken", "meat"),
            "fish": ("Fish", "meat"),
            "yogurt": ("Yogurt", "dairy"),
            "cheese": ("Cheese", "dairy"),
        }
        name = "Food Item"
        category = None
        for key, (n, c) in guess_map.items():
            if key in filename:
                name, category = n, c
                break

        # Run our existing prediction logic (storage default fridge)
        pred = await get_ml().predict_expiry({
            "name": name,
            "category": category,
            "storage_condition": "fridge",
        })

        return {
            "name": name,
            "category": category,
            "storage_condition": "fridge",
            "predicted_expiry": pred.predicted_expiry,
            "status": pred.status,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to classify image: {e}")


@router.post("/users/{user_id}/items", response_model=Item)
async def create_item(user_id: str, payload: ItemCreate) -> Item:
    try:
        ml = get_ml()
        db = get_db()
        item_dict = payload.dict()
        prediction = await ml.predict_expiry(item_dict)
        item_dict["predicted_expiry"] = prediction.predicted_expiry
        item_dict["status"] = prediction.status
        item_dict["created_at"] = datetime.utcnow()
        item_dict["updated_at"] = datetime.utcnow()
        created = await db.create_item(user_id, item_dict)
        return created
    except Exception:
        # In-memory fallback
        from uuid import uuid4
        item_id = str(uuid4())
        item_dict = payload.dict()
        prediction = await get_ml().predict_expiry(item_dict)
        item = Item(
            id=item_id,
            name=item_dict["name"],
            category=item_dict.get("category"),
            storage_condition=item_dict.get("storage_condition"),
            opened=item_dict.get("opened", False),
            predicted_expiry=prediction.predicted_expiry,
            status=prediction.status,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            purchase_date=item_dict.get("purchase_date"),
        )
        _INMEM_DB.setdefault(user_id, {})[item_id] = item.dict()
        return item


@router.get("/users/{user_id}/items/{item_id}", response_model=Item)
async def get_item(user_id: str, item_id: str) -> Item:
    try:
        db = get_db()
        item = await db.get_item(user_id, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item
    except HTTPException:
        raise
    except Exception:
        user_items = _INMEM_DB.get(user_id, {})
        data = user_items.get(item_id)
        if not data:
            raise HTTPException(status_code=404, detail="Item not found")
        return Item(**data)


@router.patch("/users/{user_id}/items/{item_id}", response_model=Item)
async def update_item(user_id: str, item_id: str, payload: ItemUpdate) -> Item:
    try:
        db = get_db()
        update_data = {k: v for k, v in payload.dict(exclude_unset=True).items()}
        update_data["updated_at"] = datetime.utcnow()
        updated = await db.update_item(user_id, item_id, update_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Item not found")
        return updated
    except HTTPException:
        raise
    except Exception:
        # In-memory fallback
        user_items = _INMEM_DB.setdefault(user_id, {})
        existing = user_items.get(item_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")
        existing.update({k: v for k, v in payload.dict(exclude_unset=True).items()})
        existing["updated_at"] = datetime.utcnow()
        return Item(**existing)


@router.delete("/users/{user_id}/items/{item_id}")
async def delete_item(user_id: str, item_id: str) -> dict:
    try:
        db = get_db()
        deleted = await db.delete_item(user_id, item_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"deleted": True}
    except HTTPException:
        raise
    except Exception:
        # In-memory fallback
        user_items = _INMEM_DB.setdefault(user_id, {})
        if item_id not in user_items:
            raise HTTPException(status_code=404, detail="Item not found")
        del user_items[item_id]
        return {"deleted": True}


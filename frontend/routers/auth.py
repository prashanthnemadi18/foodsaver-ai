from datetime import datetime, timedelta
from typing import Any

import jwt
from fastapi import APIRouter, HTTPException

from ..config import get_settings
from ..models.schemas import UserCreate, UserLogin, UserOut, Token
from ..services.users import UserService

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_token(user_id: str) -> Token:
    settings = get_settings()
    now = datetime.utcnow()
    exp = now + timedelta(minutes=settings.jwt_exp_minutes)
    payload: dict[str, Any] = {
        "sub": user_id,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    encoded = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return Token(access_token=encoded, token_type="bearer", user_id=user_id)


@router.post("/register", response_model=UserOut)
async def register(body: UserCreate) -> UserOut:
    try:
        svc = UserService()
        user = await svc.create_user(body.username, body.password)
        return UserOut(id=user["id"], username=user["username"], created_at=user["created_at"])  # type: ignore[arg-type]
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {e}")


@router.post("/login", response_model=Token)
async def login(body: UserLogin) -> Token:
    try:
        svc = UserService()
        user = await svc.verify_user(body.username, body.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return _issue_token(user_id=user["id"])  # type: ignore[index]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {e}")

"""
FloodShield AI - Authentication Route & JWT Authorization
Supports USER and ADMIN roles with secure password hashing and JWT issuance.
"""
import datetime
from typing import Optional
import jwt
import bcrypt
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from app.config import settings
from app.database.mongodb import db_manager

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "USER" # USER or ADMIN
    phone: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token required"
        )
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # Check users collection
        users = db_manager.get_collection("users")
        user = users.find_one({"_id": user_id})
        if not user:
            # Check default admin
            if payload.get("email") == settings.DEFAULT_ADMIN_EMAIL:
                return {
                    "_id": "admin-system",
                    "email": settings.DEFAULT_ADMIN_EMAIL,
                    "name": "System Administrator",
                    "role": "ADMIN"
                }
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    users = db_manager.get_collection("users")
    existing = users.find_one({"email": req.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed = hash_password(req.password)
    user_doc = {
        "name": req.name,
        "email": req.email.lower(),
        "password": hashed,
        "role": req.role.upper() if req.role.upper() in ["USER", "ADMIN"] else "USER",
        "phone": req.phone,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    res = users.insert_one(user_doc)
    user_doc["_id"] = str(res.inserted_id)
    user_safe = {k: v for k, v in user_doc.items() if k != "password"}

    token = create_access_token({"sub": user_doc["_id"], "email": user_doc["email"], "role": user_doc["role"]})
    return {"access_token": token, "token_type": "bearer", "user": user_safe}

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    email = req.email.lower()
    
    # Check if default admin login
    if email == settings.DEFAULT_ADMIN_EMAIL.lower() and req.password == settings.DEFAULT_ADMIN_PASSWORD:
        admin_user = {
            "_id": "admin-system",
            "name": "System Disaster Admin",
            "email": settings.DEFAULT_ADMIN_EMAIL,
            "role": "ADMIN"
        }
        token = create_access_token({"sub": admin_user["_id"], "email": admin_user["email"], "role": "ADMIN"})
        return {"access_token": token, "token_type": "bearer", "user": admin_user}

    users = db_manager.get_collection("users")
    user = users.find_one({"email": email})
    if not user or not verify_password(req.password, user.get("password", "")):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    user_safe = {k: v for k, v in user.items() if k != "password"}
    token = create_access_token({"sub": user["_id"], "email": user["email"], "role": user.get("role", "USER")})
    return {"access_token": token, "token_type": "bearer", "user": user_safe}

@router.get("/me")
def get_profile(user: dict = Depends(get_current_user)):
    return {k: v for k, v in user.items() if k != "password"}

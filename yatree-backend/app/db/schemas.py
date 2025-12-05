from pydantic import BaseModel, EmailStr
from typing import Optional

# Auth
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str]
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone : Optional[str]
    wallet_balance: float

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Fare
class FareRequest(BaseModel):
    pickup_lat: float
    pickup_lng: float
    drop_lat: float
    drop_lng: float
    ride_type: str = "mini"

class FareResponse(BaseModel):
    distance_km: float
    fare: float

# Trip
class TripCreate(BaseModel):
    user_id: int
    pickup: str
    drop: str
    pickup_lat: float
    pickup_lng: float
    drop_lat: float
    drop_lng: float
    ride_type: str

class TripOut(BaseModel):
    id: int
    user_id: int
    driver_id: Optional[int]
    pickup: str
    drop: str
    fare: float
    status: str

    class Config:
        orm_mode = True

# Driver
class DriverCreate(BaseModel):
    name: str
    phone: Optional[str]
    car_model: Optional[str]
    car_number: Optional[str]
    lat: Optional[float]
    lng: Optional[float]

class DriverOut(BaseModel):
    id: int
    name: str
    lat: Optional[float]
    lng: Optional[float]
    available: bool

    class Config:
        orm_mode = True

# Wallet
class WalletAction(BaseModel):
    user_id: int
    amount: float

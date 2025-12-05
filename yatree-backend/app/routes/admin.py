from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Trip, Driver, User
from app.db import schemas

router = APIRouter(prefix="/admin", tags=["admin"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/trips", response_model=list[schemas.TripOut])
def list_trips(db: Session = Depends(get_db)):
    trips = db.query(Trip).all()
    return trips

@router.get("/drivers", response_model=list[schemas.DriverOut])
def list_drivers(db: Session = Depends(get_db)):
    drivers = db.query(Driver).all()
    return drivers

@router.get("/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

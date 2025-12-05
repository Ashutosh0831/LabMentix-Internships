from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Driver
from app.db import schemas

router = APIRouter(prefix="/drivers", tags=["drivers"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=schemas.DriverOut)
def create_driver(payload: schemas.DriverCreate, db: Session = Depends(get_db)):
    d = Driver(**payload.dict())
    db.add(d)
    db.commit()
    db.refresh(d)
    return d

@router.get("/available", response_model=list[schemas.DriverOut])
def list_available_drivers(db: Session = Depends(get_db)):
    drivers = db.query(Driver).filter(Driver.available == True).all()
    return drivers

@router.post("/{driver_id}/toggle")
def toggle_driver(driver_id: int, available: bool, db: Session = Depends(get_db)):
    d = db.query(Driver).get(driver_id)
    if not d:
        raise HTTPException(404, "Driver not found")
    d.available = available
    db.commit()
    db.refresh(d)
    return {"driver_id": d.id, "available": d.available}

@router.post("/{driver_id}/location")
def update_location(driver_id: int, lat: float, lng: float, db: Session = Depends(get_db)):
    d = db.query(Driver).get(driver_id)
    if not d:
        raise HTTPException(404, "Driver not found")
    d.lat = lat
    d.lng = lng
    db.commit()
    db.refresh(d)
    return {"ok": True}

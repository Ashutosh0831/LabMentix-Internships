from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import SessionLocal
from app.db.models import Trip, Driver, User
from app.db import schemas
from app.services.distance import calculate_distance
from app.services.fare_engine import calculate_fare

router = APIRouter(prefix="/trips", tags=["trips"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper: naive nearest driver matcher
def find_nearest_driver(db: Session, pickup_lat: float, pickup_lng: float, max_km: float = 10.0) -> Optional[Driver]:
    drivers = db.query(Driver).filter(Driver.available == True, Driver.lat != None, Driver.lng != None).all()
    best = None
    best_dist = None
    for d in drivers:
        dist = calculate_distance((pickup_lat, pickup_lng), (d.lat, d.lng))
        if dist <= max_km and (best_dist is None or dist < best_dist):
            best = d
            best_dist = dist
    return best

@router.post("/book", response_model=schemas.TripOut)
def book_trip(payload: schemas.TripCreate, db: Session = Depends(get_db)):
    user = db.query(User).get(payload.user_id)
    if not user:
        raise HTTPException(404, "User not found")

    distance = calculate_distance((payload.pickup_lat, payload.pickup_lng), (payload.drop_lat, payload.drop_lng))
    fare = calculate_fare(distance, payload.ride_type)

    # create trip record (driver assigned later)
    trip = Trip(
        user_id=payload.user_id,
        pickup=payload.pickup,
        drop=payload.drop,
        pickup_lat=payload.pickup_lat,
        pickup_lng=payload.pickup_lng,
        drop_lat=payload.drop_lat,
        drop_lng=payload.drop_lng,
        ride_type=payload.ride_type,
        fare=fare,
        distance_km=round(distance, 2),
        status="requested",
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)

    # find driver
    driver = find_nearest_driver(db, payload.pickup_lat, payload.pickup_lng)
    if driver:
        trip.driver_id = driver.id
        trip.status = "accepted"
        driver.available = False  # mark driver busy
        db.commit()
        db.refresh(trip)
        db.refresh(driver)

    return trip

@router.post("/{trip_id}/start")
def start_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).get(trip_id)
    if not trip:
        raise HTTPException(404, "Trip not found")
    trip.status = "on_trip"
    db.commit()
    db.refresh(trip)
    return {"ok": True, "status": trip.status}

@router.post("/{trip_id}/complete")
def complete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).get(trip_id)
    if not trip:
        raise HTTPException(404, "Trip not found")
    trip.status = "completed"
    # free driver
    if trip.driver_id:
        driver = db.query(Driver).get(trip.driver_id)
        if driver:
            driver.available = True
            db.commit()
    db.commit()
    db.refresh(trip)
    return {"ok": True, "status": trip.status}

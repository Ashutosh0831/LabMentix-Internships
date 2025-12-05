from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.distance import calculate_distance
from app.services.fare_engine import calculate_fare
from app.db import schemas

router = APIRouter(prefix="/fare", tags=["fare"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/estimate", response_model=schemas.FareResponse)
def estimate_fare(payload: schemas.FareRequest, db: Session = Depends(get_db)):
    pickup = (payload.pickup_lat, payload.pickup_lng)
    drop = (payload.drop_lat, payload.drop_lng)
    distance = calculate_distance(pickup, drop)
    fare = calculate_fare(distance, payload.ride_type)
    return {"distance_km": round(distance, 2), "fare": fare}

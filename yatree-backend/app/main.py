from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from fastapi import Request
from app.db.database import Base, engine, SessionLocal
from app.realtime.websocket_manager import manager
from app.routes import auth, drivers, fare, trips, wallets, admin
from app.db import models

# create DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cab Booking Backend")



origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Debug middleware: log Origin header and request info to help diagnose CORS issues.
logger = logging.getLogger("uvicorn.error")


# @app.middleware("http")
# async def log_origin_middleware(request: Request, call_next):
#     origin = request.headers.get("origin")
#     logger.info("Incoming request %s %s Origin=%s Allowed=%s", request.method, request.url.path, origin)
#     response = await call_next(request)
#     # Also log response CORS header presence for troubleshooting
#     acao = response.headers.get("access-control-allow-origin")
#     logger.info("Response for %s %s has Access-Control-Allow-Origin=%s", request.method, request.url.path, acao)
#     return response

# include routers
app.include_router(auth.router)
app.include_router(drivers.router)
app.include_router(fare.router)
app.include_router(trips.router)
app.include_router(wallets.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Cab Booking Backend Running"}

# WebSocket endpoints
@app.websocket("/ws/driver/{driver_id}")
async def driver_ws(websocket: WebSocket, driver_id: int):
    await manager.connect_driver(driver_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # expect payload: {"lat":..., "lng":..., "trip_id": optional}
            lat = data.get("lat")
            lng = data.get("lng")
            trip_id = data.get("trip_id")
            # broadcast to trip subscribers if provided
            if trip_id:
                await manager.send_location_update_to_trip(trip_id, {"driver_id": driver_id, "lat": lat, "lng": lng})
    except WebSocketDisconnect:
        await manager.disconnect_driver(driver_id)

@app.websocket("/ws/rider/{trip_id}")
async def rider_ws(websocket: WebSocket, trip_id: int):
    await manager.connect_rider_to_trip(trip_id, websocket)
    try:
        while True:
            # keep connection alive; rider could send pings
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect_rider_from_trip(trip_id, websocket)

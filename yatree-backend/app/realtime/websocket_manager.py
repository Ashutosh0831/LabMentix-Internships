from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # driver_id -> websocket
        self.driver_connections: Dict[int, WebSocket] = {}
        # trip_id -> list[websocket] (rider sockets subscribed to trip)
        self.trip_subscriptions: Dict[int, List[WebSocket]] = {}

    async def connect_driver(self, driver_id: int, websocket: WebSocket):
        await websocket.accept()
        self.driver_connections[driver_id] = websocket

    async def disconnect_driver(self, driver_id: int):
        ws = self.driver_connections.pop(driver_id, None)
        if ws:
            await ws.close()

    async def connect_rider_to_trip(self, trip_id: int, websocket: WebSocket):
        await websocket.accept()
        self.trip_subscriptions.setdefault(trip_id, []).append(websocket)

    async def disconnect_rider_from_trip(self, trip_id: int, websocket: WebSocket):
        conns = self.trip_subscriptions.get(trip_id, [])
        if websocket in conns:
            conns.remove(websocket)

    async def send_location_update_to_trip(self, trip_id: int, data: dict):
        conns = self.trip_subscriptions.get(trip_id, [])
        for ws in conns:
            try:
                await ws.send_json({"type": "location_update", **data})
            except:
                # ignore failed sends
                pass

    async def send_driver_update(self, driver_id: int, data: dict):
        # If needed send to specific driver
        ws = self.driver_connections.get(driver_id)
        if ws:
            await ws.send_json(data)

manager = ConnectionManager()

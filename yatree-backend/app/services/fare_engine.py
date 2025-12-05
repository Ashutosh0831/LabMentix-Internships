def calculate_fare(distance_km: float, ride_type: str):
    base_fares = {
        "mini": 10,
        "sedan": 15,
        "suv": 20,
        "auto": 8,
    }

    per_km = {
        "mini": 12,
        "sedan": 15,
        "suv": 18,
        "auto": 10,
    }

    base = base_fares.get(ride_type, 10)
    multiplier = per_km.get(ride_type, 12)

    return round(base + (distance_km * multiplier), 2)

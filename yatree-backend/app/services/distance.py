from geopy.distance import geodesic

def calculate_distance(pickup, drop):
    return geodesic(pickup, drop).km

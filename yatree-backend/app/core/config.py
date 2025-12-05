from datetime import timedelta

JWT_SECRET = "CHANGE_THIS_SECRET_TO_A_STRONG_VALUE"
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Fare defaults (you can tune)
DEFAULT_BASE = {"mini": 10, "sedan": 15, "suv": 20, "auto": 8}
DEFAULT_PER_KM = {"mini": 12, "sedan": 15, "suv": 18, "auto": 10}

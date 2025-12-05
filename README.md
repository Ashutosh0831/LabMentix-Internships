
- Deploy frontend on **Vercel**  
- Deploy backend on **Docker-compatible platforms** (Render, Railway, AWS ECS, DigitalOcean App)  
- Use **managed Postgres + Redis** services  

---

## Data Models

- **users**: id, name, email, phone, role (rider/driver), profile_pic, rating_avg  
- **drivers**: user_id FK, vehicle_info, verified, current_location (geom), status  
- **rides**: id, rider_id, driver_id, pickup_point, drop_point, status, fare_estimate, fare_actual, distance_meters, duration_secs, created_at  
- **payments**: id, ride_id, stripe_payment_intent_id, amount, status  
- **reviews**: id, ride_id, rater_id, rated_id, rating, comment  

> Use **PostGIS geometry** types for pickup/drop points and geospatial indices for nearby driver queries.

---

## Example API Endpoints (FastAPI)

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/auth/session` | Verify token from Clerk/Supabase |
| POST   | `/api/rides/request` | Create ride request |
| GET    | `/api/rides/estimate?origin=...&dest=...` | Return fare estimate |
| GET    | `/api/rides/{id}/status` | Poll ride status or subscribe via WebSocket |
| POST   | `/api/webhooks/stripe` | Handle Stripe payment events |
| WS     | `/ws/driver/{driver_id}` | Driver socket for ride requests & location |
| WS     | `/ws/rider/{rider_id}` | Rider socket to watch driver |

---

## Two-Week Python-Centric Schedule

**Week 1: Core Backend & Integration**

1. Project init, auth integration, FastAPI scaffold  
2. Database setup + SQLModel/SQLAlchemy models + Alembic migrations  
3. Ride request + fare estimation  
4. Driver dashboard & nearby-driver matching  
5. Real-time basics with Socket.IO / FastAPI WebSockets  
6. Stripe payment integration + webhooks  
7. Buffer & testing  

**Week 2: Features, Hardening & Deployment**

8. Ride history & PDF/email receipts via Celery  
9. Ratings & reviews endpoints  
10. Promo codes & wallet integration  
11. UI enhancements (Next.js + Tailwind)  
12. Security & performance improvements  
13. End-to-end testing  
14. Dockerization & deployment  

---

## Implementation Notes

- **Geospatial Queries:** `ST_DistanceSphere` / `ST_DWithin` in PostGIS  
- **Real-time Scaling:** Redis pub/sub + multiple Socket.IO workers  
- **Background Jobs:** Celery for slow tasks (receipts, cleanup)  
- **Testing:** `pytest` + `HTTPX AsyncClient`; use `FactoryBoy` for fixtures  
- **Security:** Verify auth tokens server-side; secure webhook endpoints; never expose secret keys  

---

## Admin & Operations

- Role-protected FastAPI endpoints  
- Monitoring: Prometheus + Grafana or hosted solution  
- Logs: Centralized log storage  
- CI/CD: GitHub Actions or GitLab CI with automated Alembic migrations  

---

## Resources

**Official Docs**

- [FastAPI](https://fastapi.tiangolo.com/)  
- [Stripe Python SDK](https://docs.stripe.com/sdks)  
- [Google Maps Python Client](https://developers.google.com/maps/web-services/client-library)  
- [python-socketio](https://python-socketio.readthedocs.io/)  
- [Celery](https://docs.celeryq.dev/)  
- [Supabase Python Auth](https://supabase.com/docs/reference/python/auth-signinwithoauth)  

**Libraries & Tools**

- SQLModel / SQLAlchemy / Alembic  
- psycopg2 / asyncpg  
- python-socketio  
- stripe-python  
- googlemaps  
- Celery + Redis  
- WeasyPrint / wkhtmltopdf  
- pytest + HTTPX  

**Example Repos**

- [parthasarathydNU/uber-ride-api](https://github.com/parthasarathydNU/uber-ride-api)  
- [googlemaps/google-maps-services-python](https://github.com/googlemaps/google-maps-services-python)  

---

## Quick Dev Setup (Local)

```bash
# create backend virtual environment
python -m venv env
source env/bin/activate

# install dependencies
pip install fastapi uvicorn sqlmodel asyncpg alembic python-socketio[asyncio] redis celery stripe googlemaps

# run dev server
uvicorn backend.main:app --reload

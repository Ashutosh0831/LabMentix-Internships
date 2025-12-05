from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User, Transaction
from app.db import schemas

router = APIRouter(prefix="/wallet", tags=["wallet"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add")
def add_funds(payload: schemas.WalletAction, db: Session = Depends(get_db)):
    user = db.query(User).get(payload.user_id)
    if not user:
        raise HTTPException(404, "User not found")
    user.wallet_balance += payload.amount
    tx = Transaction(user_id=user.id, amount=payload.amount, type="credit", reference="manual_topup")
    db.add(tx)
    db.commit()
    db.refresh(user)
    return {"balance": user.wallet_balance}

@router.post("/pay")
def pay_for_trip(payload: schemas.WalletAction, db: Session = Depends(get_db)):
    # here payload.user_id is payer, payload.amount is cost
    user = db.query(User).get(payload.user_id)
    if not user:
        raise HTTPException(404, "User not found")
    if user.wallet_balance < payload.amount:
        raise HTTPException(400, "Insufficient funds")
    user.wallet_balance -= payload.amount
    tx = Transaction(user_id=user.id, amount=payload.amount, type="debit", reference="trip_payment")
    db.add(tx)
    db.commit()
    db.refresh(user)
    return {"balance": user.wallet_balance}

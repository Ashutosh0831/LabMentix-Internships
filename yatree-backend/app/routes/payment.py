from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import stripe
from decouple import config

stripe.api_key = config("STRIPE_SECRET_KEY")  

router = APIRouter(prefix="/payment", tags=["payment"])

class PaymentRequest(BaseModel):
    amount: float  # in INR
    currency: str = "inr"

@router.post("/create-payment-intent")
def create_payment_intent(payload: PaymentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(payload.amount * 100),  # Stripe expects paise
            currency=payload.currency,
            payment_method_types=["card", "upi"],
        )
        return {"client_secret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

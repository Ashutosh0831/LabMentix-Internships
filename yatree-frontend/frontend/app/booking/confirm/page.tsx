"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../../lib/api";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe
const stripePromise = loadStripe("publish key");

interface PaymentFormProps {
  fare: number;
}

const CheckoutForm = ({ fare }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const createPayment = async () => {
      const res = await api.post("/payment/create-payment-intent", { amount: fare });
      setClientSecret(res.data.client_secret);
    };
    createPayment();
  }, [fare]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      alert("Payment Successful!");
      // Redirect to success page or booking confirmed
      window.location.href = "/dashboard/user";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Pay ₹{fare}
      </button>
    </form>
  );
};

export default function ConfirmBooking() {
  const searchParams = useSearchParams();
  const fare = Number(searchParams.get("fare") || 0);

  return (
    <div className="p-8 text-center max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Confirm Booking</h1>
      <p className="text-xl mb-4">Fare: ₹{fare}</p>

      <Elements stripe={stripePromise}>
        <CheckoutForm fare={fare} />
      </Elements>
    </div>
  );
}

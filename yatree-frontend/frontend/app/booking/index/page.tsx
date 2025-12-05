"use client";

import { useState } from "react";
import Link from "next/link";
import { getFare } from "../../../lib/api";

/* ---------------------- TYPES ---------------------- */
interface LatLng {
  lat: number;
  lng: number;
}

interface PlaceSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

/* ---------------------- COMPONENT ---------------------- */
export default function BookingPage() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [dropCoords, setDropCoords] = useState<LatLng | null>(null);

  const [pickupSuggestions, setPickupSuggestions] = useState<PlaceSuggestion[]>(
    []
  );
  const [dropSuggestions, setDropSuggestions] = useState<PlaceSuggestion[]>([]);

  const [fare, setFare] = useState<number | null>(null);

  /* ---------------------- SEARCH FUNCTION ---------------------- */
  const searchLocation = async (
    query: string,
    setSuggestions: React.Dispatch<React.SetStateAction<PlaceSuggestion[]>>
  ) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`,
      {
        headers: {
          "User-Agent": "Yatree-App-1.0", // Required by Nominatim
        },
      }
    );

    const data: PlaceSuggestion[] = await res.json();
    setSuggestions(data);
  };

  /* ---------------------- SELECT PICKUP ---------------------- */
  const selectPickup = (place: PlaceSuggestion) => {
    setPickup(place.display_name);
    setPickupCoords({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setPickupSuggestions([]);
  };

  /* ---------------------- SELECT DROP ---------------------- */
  const selectDrop = (place: PlaceSuggestion) => {
    setDrop(place.display_name);
    setDropCoords({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setDropSuggestions([]);
  };

  /* ---------------------- CURRENT LOCATION ---------------------- */
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPickupCoords({ lat, lng });

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();

        setPickup(data.display_name);
      },
      () => alert("Unable to get location")
    );
  };

  /* ---------------------- CHECK FARE ---------------------- */
  const checkFare = async () => {
    if (!pickupCoords || !dropCoords) {
      alert("Please select valid pickup and drop locations!");
      return;
    }

    const res = await getFare({
      pickup_lat: pickupCoords.lat,
      pickup_lng: pickupCoords.lng,
      drop_lat: dropCoords.lat,
      drop_lng: dropCoords.lng,
      ride_type: "mini",
    });
    setFare(res.data.fare);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book Your Cab</h1>

      {/* Pickup Input */}
      <label className="font-semibold">Pickup Location</label>
      <input
        className="border p-2 w-full rounded mb-2"
        value={pickup}
        placeholder="Search pickup..."
        onChange={(e) => {
          setPickup(e.target.value);
          searchLocation(e.target.value, setPickupSuggestions);
        }}
      />

      {/* Pickup Suggestions */}
      {pickupSuggestions.length > 0 && (
        <ul className="border rounded bg-white mb-3 max-h-48 overflow-y-auto">
          {pickupSuggestions.map((place, i) => (
            <li
              key={i}
              onClick={() => selectPickup(place)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* Current Location Button */}
      <button
        onClick={getCurrentLocation}
        className="bg-gray-200 px-3 py-2 rounded mb-4 w-full font-semibold"
      >
        Use Current Location
      </button>

      {/* Drop Input */}
      <label className="font-semibold">Drop Location</label>
      <input
        className="border p-2 w-full rounded mb-2"
        value={drop}
        placeholder="Search drop..."
        onChange={(e) => {
          setDrop(e.target.value);
          searchLocation(e.target.value, setDropSuggestions);
        }}
      />

      {/* Drop Suggestions */}
      {dropSuggestions.length > 0 && (
        <ul className="border rounded bg-white mb-4 max-h-48 overflow-y-auto">
          {dropSuggestions.map((place, i) => (
            <li
              key={i}
              onClick={() => selectDrop(place)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* Check Fare Button */}
      <button
        onClick={checkFare}
        className="bg-green-600 text-white px-4 py-3 rounded-lg w-full font-semibold"
      >
        Check Fare
      </button>

      {/* Fare Display */}
      {fare !== null && (
        <div className="mt-6 p-4 border rounded shadow bg-white">
          <h2 className="text-xl font-bold">Estimated Fare</h2>
          <p className="text-2xl mt-2 font-semibold text-green-700">₹{fare}</p>

          <Link
            href={`/booking/confirm?fare=${fare}`}
            className="block mt-4 bg-blue-600 text-white p-3 rounded text-center"
          >
            Proceed to Booking
          </Link>
        </div>
      )}
    </div>
  );
}

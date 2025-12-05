"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Car, History, LogOut, Menu } from "lucide-react";
import api from "@/lib/api";

interface UserProfile {
  name: string;
}

interface Ride {
  id: string;
  pickup: string;
  drop: string;
  driver_name?: string;
  fare: number;
  status?: string;
}

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [pastRides, setPastRides] = useState<Ride[]>([]);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [userRes, activeRes, pastRes] = await Promise.all([
          api.get("/auth/user", { headers }),
          api.get("/rides/active", { headers }),
          api.get("/rides/history", { headers }),
        ]);

        setProfile(userRes.data);
        setActiveRide(activeRes.data.active_ride || null);
        setPastRides(pastRes.data.history || []);
      } catch (err) {
        console.log("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10">Loading dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-5 transform transition-transform duration-300 z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-6">User Dashboard</h2>

        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-gray-700"
          >
            <User size={20} /> Profile
          </Link>

          <Link
            href="/booking/index"
            className="flex items-center gap-3 text-gray-700"
          >
            <Car size={20} /> Book a Ride
          </Link>

          <Link
            href="/dashboard/history"
            className="flex items-center gap-3 text-gray-700"
          >
            <History size={20} /> Ride History
          </Link>

          <button
            className="flex items-center gap-3 text-red-600 mt-5"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 ml-0 md:ml-64">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu size={26} />
          </button>

          <h1 className="text-2xl font-bold">Welcome Back 👋</h1>

          <div className="font-semibold">Hi, {profile?.name || "User"}</div>
        </div>

        {/* Active Ride */}
        <div className="bg-white shadow-md rounded-xl p-5 mb-6">
          <h2 className="text-xl font-bold mb-4">Active Ride</h2>

          {activeRide ? (
            <div>
              <p>
                <strong>Pickup:</strong> {activeRide.pickup}
              </p>
              <p>
                <strong>Drop:</strong> {activeRide.drop}
              </p>
              <p>
                <strong>Driver:</strong> {activeRide.driver_name}
              </p>
              <p>
                <strong>Fare:</strong> ₹{activeRide.fare}
              </p>
              <p className="mt-2 text-green-600 font-semibold">
                Status: {activeRide.status}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No active ride.</p>
          )}
        </div>

        {/* Past Rides */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-xl font-bold mb-4">Past Rides</h2>

          {pastRides.length === 0 && (
            <p className="text-gray-500">No past rides found.</p>
          )}

          {pastRides.map((ride) => (
            <div
              key={ride.id}
              className="border-b py-3 last:border-b-0 flex justify-between text-gray-700"
            >
              <span>
                {ride.pickup} → {ride.drop}
              </span>
              <span className="font-semibold">₹{ride.fare}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

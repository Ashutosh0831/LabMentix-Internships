"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
  useEffect(() => {
    // Prevent duplicate map rendering
    if (typeof window !== "undefined" && !window.myMap) {
      const map = L.map("map").setView([25.6, 85.1], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Optional marker example
      L.marker([25.6, 85.1]).addTo(map).bindPopup("Your Location");

      window.myMap = map;
    }
  }, []);

  return (
    <div id="map" style={{ width: "100%", height: "400px" }}></div>
  );
}

"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function RideStatus() {
  const [status, setStatus] = useState("Searching…");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await api.get("/ride/status");
      setStatus(res.data.status);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return <h1 className="text-3xl p-6">{status}</h1>;
}

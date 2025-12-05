import api from "../../lib/api";

export default function BookRide() {
  const book = async () => {
    await api.post("/ride/book", {
      pickup: "Pickup Address",
      drop: "Drop Address",
      car_type: "mini",
    });
    alert("Ride Booked!");
    window.location.href = "/ride/status";
  };

  return (
    <div className="p-6">
      <button onClick={book} className="btn-primary">
        Book Ride
      </button>
    </div>
  );
}

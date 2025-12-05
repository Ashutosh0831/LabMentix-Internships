interface PickupDropFormProps {
  onCalculate: (pickup: string, drop: string) => void;
}

export default function PickupDropForm({ onCalculate }: PickupDropFormProps) {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg mt-4">
      <input className="input" placeholder="Pickup Location" id="pickup" />
      <input className="input mt-2" placeholder="Drop Location" id="drop" />

      <button
        onClick={() =>
          onCalculate(
            (document.getElementById("pickup") as HTMLInputElement).value,
            (document.getElementById("drop") as HTMLInputElement).value
          )
        }
        className="btn-primary mt-3"
      >
        Get Fare Estimate
      </button>
    </div>
  );
}

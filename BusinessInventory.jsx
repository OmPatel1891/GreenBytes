import { useNavigate } from "react-router-dom";

function BusinessInventory() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-md mx-auto border rounded">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      <p className="mb-4">E-waste inventory details will be displayed here.</p>
      <button onClick={() => navigate("/business-pickup-requests")} className="bg-blue-600 text-white w-full p-2 rounded">Next</button>
    </div>
  );
}

export default BusinessInventory;

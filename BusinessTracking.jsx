import { useNavigate } from "react-router-dom";

function BusinessTracking() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-md mx-auto border rounded">
      <h2 className="text-2xl font-bold mb-4">Tracking Status</h2>
      <p className="mb-4">Tracking details of pickup requests will be shown here.</p>
      <button onClick={() => navigate("/business-dashboard")} className="bg-blue-600 text-white w-full p-2 rounded">Back to Dashboard</button>
    </div>
  );
}

export default BusinessTracking;

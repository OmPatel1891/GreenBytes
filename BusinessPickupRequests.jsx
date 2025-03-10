import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { FaTruck, FaMapMarkerAlt, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

function BusinessPickupRequest() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      const requestDoc = await getDoc(doc(db, "requests", requestId));
      if (requestDoc.exists()) {
        setRequest(requestDoc.data());
        setStatus(requestDoc.data().status);
      }
    };

    fetchRequest();
  }, [requestId]);

  const updateStatus = async (newStatus) => {
    try {
      // Update the request status
      await updateDoc(doc(db, "requests", requestId), {
        status: newStatus,
      });

      // Add a new activity to the user's recent activities
      const activityMessage = getActivityMessage(newStatus);
      await addDoc(collection(db, "recentActivities"), {
        userId: request.userId,
        message: activityMessage,
        timestamp: new Date(),
      });

      setStatus(newStatus);
      alert(`Status updated to: ${newStatus}`);
    } catch (err) {
      console.error("Error updating status: ", err);
      alert("Failed to update status.");
    }
  };

  const getActivityMessage = (status) => {
    switch (status) {
      case "agent-coming":
        return "Delivery agent is coming to pick the E-waste.";
      case "agent-arrived":
        return "Delivery agent has arrived at your location.";
      case "ewaste-checked":
        return "E-waste has been checked.";
      case "payment-received":
        return "Payment has been received.";
      default:
        return "Status updated.";
    }
  };

  if (!request) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-8">Pickup Request Tracking</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Request Details</h2>
          <p className="text-gray-600"><strong>User:</strong> {request.userName} ({request.userEmail})</p>
          <p className="text-gray-600"><strong>E-Waste Type:</strong> {request.ewasteType}</p>
          <p className="text-gray-600"><strong>Quantity:</strong> {request.quantity} kg</p>
          <p className="text-gray-600"><strong>Description:</strong> {request.description || "No description available"}</p>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Update Pickup Status</h2>
          <div className="space-y-4">
            <div
              className={`flex items-center p-4 rounded-lg cursor-pointer ${
                status === "agent-coming" ? "bg-green-100" : "hover:bg-green-100"
              }`}
              onClick={() => updateStatus("agent-coming")}
            >
              <FaTruck className="text-green-700 mr-4" size={24} />
              <span className="text-gray-700">1. Delivery agent is coming to pick the E-waste</span>
            </div>
            <div
              className={`flex items-center p-4 rounded-lg cursor-pointer ${
                status === "agent-arrived" ? "bg-green-100" : "hover:bg-green-100"
              }`}
              onClick={() => updateStatus("agent-arrived")}
            >
              <FaMapMarkerAlt className="text-green-700 mr-4" size={24} />
              <span className="text-gray-700">2. Delivery agent has arrived at your location</span>
            </div>
            <div
              className={`flex items-center p-4 rounded-lg cursor-pointer ${
                status === "ewaste-checked" ? "bg-green-100" : "hover:bg-green-100"
              }`}
              onClick={() => updateStatus("ewaste-checked")}
            >
              <FaCheckCircle className="text-green-700 mr-4" size={24} />
              <span className="text-gray-700">3. E-waste has been checked</span>
            </div>
            <div
              className={`flex items-center p-4 rounded-lg cursor-pointer ${
                status === "payment-received" ? "bg-green-100" : "hover:bg-green-100"
              }`}
              onClick={() => updateStatus("payment-received")}
            >
              <FaMoneyBillWave className="text-green-700 mr-4" size={24} />
              <span className="text-gray-700">4. Payment has been received</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate("/business-dashboard")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default BusinessPickupRequest;
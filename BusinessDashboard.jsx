import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { FaHome, FaBuilding, FaBox, FaChartLine, FaUser, FaSignOutAlt, FaBell, FaCheck, FaTimes } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function BusinessDashboard() {
  const [currentView, setCurrentView] = useState("overview");
  const [totalEwaste, setTotalEwaste] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [businessName, setBusinessName] = useState("");
  const [companyDetails, setCompanyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for editable profile fields
  const [editableProfile, setEditableProfile] = useState({
    username: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  // Fetch business name and details
  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      // Fetch business name and details
      const fetchBusinessDetails = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBusinessName(data.username);
          setCompanyDetails(data);
          setEditableProfile({
            username: data.username || "",
            email: data.email || "",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              postalCode: data.address?.postalCode || "",
              country: data.address?.country || "",
            },
          });
        }
      };

      fetchBusinessDetails();

      // Fetch total e-waste taken by the business
      const ewasteQuery = query(collection(db, "ewasteReports"), where("businessId", "==", user.uid));
      const unsubscribeEwaste = onSnapshot(ewasteQuery, (querySnapshot) => {
        let total = 0;
        querySnapshot.forEach((doc) => {
          total += doc.data().quantity || 0;
        });
        setTotalEwaste(total);
      });

      // Fetch pending and completed requests
      const requestsQuery = query(collection(db, "requests"), where("businessId", "==", user.uid));
      const unsubscribeRequests = onSnapshot(
        requestsQuery,
        (querySnapshot) => {
          const pending = [];
          const completed = [];
          querySnapshot.forEach((doc) => {
            const request = { id: doc.id, ...doc.data() };
            if (request.status === "pending") {
              pending.push(request);
            } else if (request.status === "completed") {
              completed.push(request);
            }
          });
          setPendingRequests(pending);
          setCompletedRequests(completed);
        },
        (error) => {
          console.error("Error fetching requests: ", error);
        }
      );

      setLoading(false);

      // Cleanup listeners on unmount
      return () => {
        unsubscribeEwaste();
        unsubscribeRequests();
      };
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Error during logout: ", err);
    }
  };

  // Handle opening Excel sheet for inventory
  const handleOpenInventory = () => {
    // Replace with the actual link to the Excel sheet
    window.open("https://example.com/inventory-sheet.xlsx", "_blank");
  };

  // Handle accepting a request
  const handleAcceptRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, "requests", requestId), {
        status: "accepted",
      });
      navigate(`/business-pickup-request/${requestId}`); // Navigate to the tracking page
    } catch (err) {
      console.error("Error accepting request: ", err);
      alert("Failed to accept request.");
    }
  };

  // Handle rejecting a request
  const handleRejectRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, "requests", requestId), {
        status: "rejected",
      });
      alert("Request rejected successfully!");
    } catch (err) {
      console.error("Error rejecting request: ", err);
      alert("Failed to reject request.");
    }
  };

  // Handle input changes for profile fields
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditableProfile((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditableProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), editableProfile);
        setCompanyDetails(editableProfile); // Update local state
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile: ", err);
      alert("Failed to update profile.");
    }
  };

  // Dummy data for analytics
  const analyticsData = [
    { month: "Jan", eWaste: 100 },
    { month: "Feb", eWaste: 150 },
    { month: "Mar", eWaste: 200 },
    { month: "Apr", eWaste: 180 },
    { month: "May", eWaste: 250 },
    { month: "Jun", eWaste: 300 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="bg-green-700 text-white w-64 p-6">
        <h2
          className="text-3xl font-bold mb-8 cursor-pointer"
          onClick={() => navigate("/")} // Navigate to the homepage
        >
          GreenBytes
        </h2>
        <ul className="space-y-4">
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              currentView === "overview" ? "bg-green-800" : "hover:bg-green-800"
            }`}
            onClick={() => setCurrentView("overview")}
          >
            <FaHome className="mr-2" />
            Overview
          </li>
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              currentView === "company" ? "bg-green-800" : "hover:bg-green-800"
            }`}
            onClick={() => setCurrentView("company")}
          >
            <FaBuilding className="mr-2" />
            Company Details
          </li>
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              currentView === "inventory" ? "bg-green-800" : "hover:bg-green-800"
            }`}
            onClick={() => setCurrentView("inventory")}
          >
            <FaBox className="mr-2" />
            Inventory Management
          </li>
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              currentView === "analytics" ? "bg-green-800" : "hover:bg-green-800"
            }`}
            onClick={() => setCurrentView("analytics")}
          >
            <FaChartLine className="mr-2" />
            Analytics
          </li>
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              currentView === "profile" ? "bg-green-800" : "hover:bg-green-800"
            }`}
            onClick={() => setCurrentView("profile")}
          >
            <FaUser className="mr-2" />
            Profile
          </li>
          <li
            className={`flex items-center p-2 rounded-lg cursor-pointer ${
              currentView === "requests" ? "bg-green-800" : "hover:bg-green-800"
            }`}
            onClick={() => setCurrentView("requests")}
          >
            <FaBell className="mr-2" />
            Requests
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-700">Welcome, {businessName}!</h1>
            <p className="text-gray-600">Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView("profile")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              <FaSignOutAlt className="inline-block mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            {currentView === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-green-700">Total E-Waste Taken</h3>
                    <p className="text-2xl font-bold">{totalEwaste} kg</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-green-700">Pending Requests</h3>
                    <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-green-700">Completed Requests</h3>
                    <p className="text-2xl font-bold">{completedRequests.length}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Recent Requests</h3>
                  <ul className="space-y-4">
                    {pendingRequests.slice(0, 5).map((request, index) => (
                      <li key={index} className="text-gray-600">
                        {request.description || "No description available"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentView === "company" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Company Details</h3>
                <div className="space-y-4">
                  <p className="text-gray-600"><strong>Name:</strong> {companyDetails.username}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {companyDetails.email}</p>
                  <p className="text-gray-600"><strong>Address:</strong> {companyDetails.address?.street}, {companyDetails.address?.city}, {companyDetails.address?.state}, {companyDetails.address?.postalCode}, {companyDetails.address?.country}</p>
                </div>
              </div>
            )}

            {currentView === "inventory" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Inventory Management</h3>
                <button
                  onClick={handleOpenInventory}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Open Inventory Sheet
                </button>
              </div>
            )}

            {currentView === "analytics" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Analytics</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="eWaste" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {currentView === "profile" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Company Name</label>
                    <input
                      type="text"
                      name="username"
                      value={editableProfile.username}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editableProfile.email}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Street</label>
                    <input
                      type="text"
                      name="address.street"
                      value={editableProfile.address.street}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={editableProfile.address.city}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={editableProfile.address.state}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={editableProfile.address.postalCode}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={editableProfile.address.country}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            )}

            {currentView === "requests" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Pending Requests</h3>
                <ul className="space-y-4">
                  {pendingRequests.map((request) => (
                    <li key={request.id} className="text-gray-600">
                      <strong>User:</strong> {request.userName} ({request.userEmail})<br />
                      <strong>E-Waste Type:</strong> {request.ewasteType}<br />
                      <strong>Quantity:</strong> {request.quantity}<br />
                      <strong>Description:</strong> {request.description || "No description available"}<br />
                      <div className="flex space-x-4 mt-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                          <FaCheck className="inline-block mr-2" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                        >
                          <FaTimes className="inline-block mr-2" />
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BusinessDashboard;
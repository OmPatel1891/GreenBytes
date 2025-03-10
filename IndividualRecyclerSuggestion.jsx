import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { FaMapMarkerAlt, FaPhone, FaGlobe, FaCheck } from "react-icons/fa";
import { auth, db } from "../firebase"; // Import Firebase auth and db
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions

function IndividualRecyclerSuggestion() {
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve state from navigation
  const { ewasteType, quantity } = state || {}; // Destructure ewasteType and quantity

  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const [userAddress, setUserAddress] = useState(""); // State for user's address

  // Recycler data for Surat
  const recyclers = [
    {
      id: "iZkvD7rbmWMgfZFGN2ylBY92XJa2", // Unique ID for the recycler
      name: "Green Moon Waste Management Services",
      address: "11/1885, Muglisara Main Rd, Surat, Gujarat - 395010",
      mobile: "+91 9316877703",
      website: "https://gmoonwaste.com/",
      mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.091936541688!2d72.8199323685921!3d21.197531973016012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDExJzUxLjIiTiA3MsKwNDknMTQuMiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin",
    },
    {
      id: "bhH5O34V5dbGWtWYW1dUBapF4N12", // Unique ID for the recycler
      name: "Divine E-Waste Solution",
      address: "Plot No:818, New GIDC, Old GIDC, Katargam, Surat, Gujarat 395008",
      mobile: "09537383637",
      website: "http://www.divineewaste.in/",
      mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.123456789012!2d72.84093751410147!3d21.231930951805314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEzJzU1LjAiTiA3MsKwNTAnMjcuMyJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin",
    },
    {
      id: "hEU3JUgjXBSYBKdSXGYmrdDicGz2", // Unique ID for the recycler
      name: "E-Waste Management Pvt Ltd",
      address: "97, Vairaginiwadi, Delhigate, nr. Sumilon Ind. Ltd, Manchharpura, Surat, Gujarat 395003",
      mobile: "09737318484",
      website: "http://eemplindia.com/",
      mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.123456789012!2d72.83641927725957!3d21.202416715942647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEyJzA4LjciTiA3MsKwNTAnMTMuMSJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin",
    },
  ];

  const handleSelectRecycler = (recycler) => {
    setSelectedRecycler(recycler);
  };

  const handleProceed = async () => {
    if (selectedRecycler && userAddress) {
      const user = auth.currentUser;

      if (!user) {
        alert("You must be logged in to proceed.");
        return;
      }

      try {
        // Add the request to the "requests" collection
        await addDoc(collection(db, "requests"), {
          businessId: selectedRecycler.id, // Recycler's ID (businessId)
          userId: user.uid, // User's ID
          userName: user.displayName || "Anonymous", // User's name
          userEmail: user.email, // User's email
          userAddress, // User's address
          recyclerName: selectedRecycler.name, // Recycler's name
          recyclerAddress: selectedRecycler.address, // Recycler's address
          recyclerMobile: selectedRecycler.mobile, // Recycler's mobile
          recyclerWebsite: selectedRecycler.website, // Recycler's website
          ewasteType, // Dynamic value from form
          quantity, // Dynamic value from form
          status: "pending", // Request status
          timestamp: new Date(), // Timestamp of the request
        });

        // Navigate to the tracking page
        navigate("/individual-tracking", {
          state: { selectedRecycler, userAddress },
        });
      } catch (error) {
        console.error("Error saving request: ", error);
        alert("Failed to save request. Please try again.");
      }
    } else {
      alert("Please select a recycler and enter your address.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Suggested Recyclers in Surat</h2>

        {/* Address Input Field */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Enter Your Address:
          </label>
          <input
            type="text"
            placeholder="Enter your full address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />
        </div>

        {/* Recycler Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recyclers.map((recycler, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
                selectedRecycler?.id === recycler.id ? "border-2 border-green-500" : ""
              }`}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{recycler.name}</h3>

              {/* Address */}
              <div className="flex items-center mb-3">
                <FaMapMarkerAlt className="text-green-600 mr-2" />
                <p className="text-gray-600">{recycler.address}</p>
              </div>

              {/* Mobile */}
              <div className="flex items-center mb-3">
                <FaPhone className="text-green-600 mr-2" />
                <p className="text-gray-600">{recycler.mobile}</p>
              </div>

              {/* Website */}
              <div className="flex items-center mb-4">
                <FaGlobe className="text-green-600 mr-2" />
                <a
                  href={recycler.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {recycler.website}
                </a>
              </div>

              {/* Embedded Google Map */}
              <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                <iframe
                  title={`${recycler.name} Location`}
                  src={recycler.mapLink}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Select Button */}
              <button
                onClick={() => handleSelectRecycler(recycler)}
                className={`w-full p-2 rounded-lg ${
                  selectedRecycler?.id === recycler.id
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition duration-300`}
              >
                {selectedRecycler?.id === recycler.id ? (
                  <span className="flex items-center justify-center">
                    <FaCheck className="mr-2" /> Selected
                  </span>
                ) : (
                  "Select"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          className="bg-blue-600 text-white w-full p-3 rounded-lg mt-8 hover:bg-blue-700 transition duration-300"
        >
          Proceed with Selected Recycler
        </button>

        {/* Go Back to Dashboard Button */}
        <button
          onClick={() => navigate("/individual-dashboard")}
          className="bg-gray-600 text-white w-full p-3 rounded-lg mt-4 hover:bg-gray-700 transition duration-300"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default IndividualRecyclerSuggestion;
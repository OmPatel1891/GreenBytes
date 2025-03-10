import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot, collection, query, where, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaRecycle, FaCalendarAlt, FaChartLine, FaHome } from "react-icons/fa"; // Import FaHome icon

function IndividualDashboard() {
  const [userData, setUserData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    recycledItems: 0,
    totalRequests: 0,
    upcomingPickup: "No upcoming pickup",
  });
  const [recentActivities, setRecentActivities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const fetchUserData = async () => {
        try {
          // Fetch user data
          const userDoc = doc(db, "users", user.uid);
          const unsubscribeUser = onSnapshot(userDoc, (doc) => {
            if (doc.exists()) {
              setUserData(doc.data());
            } else {
              setError("No user data found");
            }
          });

          // Fetch recycling requests in real-time
          const statsQuery = query(
            collection(db, "ewasteReports"),
            where("userId", "==", user.uid)
          );
          const unsubscribeStats = onSnapshot(statsQuery, (querySnapshot) => {
            let recycledItemsCount = 0;
            let totalRequests = 0;
            let upcomingPickup = null;

            querySnapshot.forEach((doc) => {
              totalRequests++;
              if (doc.data().status === "recycled") {
                recycledItemsCount++;
              }
              if (doc.data().pickupDate) {
                const pickupDate = new Date(doc.data().pickupDate.seconds * 1000);
                if (!upcomingPickup || pickupDate < new Date(upcomingPickup)) {
                  upcomingPickup = pickupDate.toLocaleDateString();
                }
              }
            });

            setStats({
              recycledItems: recycledItemsCount,
              totalRequests,
              upcomingPickup: upcomingPickup || "No upcoming pickup",
            });
            setLoading(false);
          });

          // Fetch recent activities
          const activitiesQuery = query(
            collection(db, "recentActivities"),
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc")
          );
          const unsubscribeActivities = onSnapshot(activitiesQuery, (querySnapshot) => {
            const activities = [];
            querySnapshot.forEach((doc) => {
              activities.push(doc.data());
            });
            setRecentActivities(activities.slice(0, 3)); // Show only the 3 most recent activities
          });

          // Cleanup listeners on unmount
          return () => {
            unsubscribeUser();
            unsubscribeStats();
            unsubscribeActivities();
          };
        } catch (err) {
          console.error("Error fetching data: ", err);
          setError("Error fetching data");
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleRecycleButtonClick = () => {
    navigate("/individual-ewaste-form");
  };

  const handleHomeButtonClick = () => {
    navigate("/"); // Navigate to the homepage
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Error during logout: ", err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div
      className={`min-h-screen p-8 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
      style={{
        backgroundImage: "url('/path/to/your/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <div className="cursor-pointer" onClick={handleHomeButtonClick}>
          <FaHome className="text-2xl text-gray-700 hover:text-green-600 transition-colors" />
        </div>
        <div className="cursor-pointer" onClick={toggleSettingsMenu}>
          <div className="w-6 h-1 bg-gray-700 my-1"></div>
          <div className="w-6 h-1 bg-gray-700 my-1"></div>
          <div className="w-6 h-1 bg-gray-700 my-1"></div>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 z-10">
          <button onClick={toggleTheme} className="text-lg font-semibold text-green-600">
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
      )}

      <div className="pt-20">
        <h1 className="text-6xl font-bold text-center text-green-600 mb-8">
          Welcome, {userData?.username}!
        </h1>

        {userData?.profilePicture && (
          <div className="flex justify-center mb-8">
            <img
              src={userData.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Your Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-600 text-white p-4 rounded-lg text-center hover:scale-105 transition-transform">
              <FaRecycle className="text-3xl mx-auto mb-2" />
              <h3 className="text-lg">Recycled Items</h3>
              <p className="text-2xl">{stats.recycledItems}</p>
            </div>
            <div className="bg-blue-600 text-white p-4 rounded-lg text-center hover:scale-105 transition-transform">
              <FaChartLine className="text-3xl mx-auto mb-2" />
              <h3 className="text-lg">Total Requests</h3>
              <p className="text-2xl">{stats.totalRequests}</p>
            </div>
            <div className="bg-orange-600 text-white p-4 rounded-lg text-center hover:scale-105 transition-transform">
              <FaCalendarAlt className="text-3xl mx-auto mb-2" />
              <h3 className="text-lg">Upcoming Pickup</h3>
              <p className="text-2xl">{stats.upcomingPickup}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Recent Activities</h2>
          <ul className="space-y-4">
            {recentActivities.map((activity, index) => (
              <li key={index} className="text-gray-600">
                {activity.message || "No description available"}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-green-600 text-white p-8 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-center mb-4">Motivational Quote</h2>
          <p className="text-lg text-center italic">
            "The best way to predict the future is to create it. Keep recycling and make the world a better place!"
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleRecycleButtonClick}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Recycle E-Waste
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default IndividualDashboard;
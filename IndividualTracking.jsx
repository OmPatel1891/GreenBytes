import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 21.1702, // Default center (Surat)
  lng: 72.8311,
};

function IndividualTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedRecycler, userAddress } = location.state || {};
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [mapError, setMapError] = useState("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCzohdVJcFOJZitnA4kruuDuLxmR3Zca1Q", // Replace with your API key
  });

  useEffect(() => {
    if (selectedRecycler && userAddress && isLoaded) {
      calculateRoute();
    }
  }, [selectedRecycler, userAddress, isLoaded]);

  const calculateRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();

    // Origin: User's address
    const origin = userAddress;
    // Destination: Recycler's address
    const destination = selectedRecycler.address;

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setDuration(result.routes[0].legs[0].duration.text);
          setMapCenter(result.routes[0].bounds.getCenter());
          setMapError("");
        } else {
          console.error(`Error fetching directions: ${status}`);
          setMapError("Failed to calculate the route. Please try again.");
        }
      }
    );
  };

  if (loadError) {
    return <div className="text-red-500 text-center">Error loading maps. Please check your API key.</div>;
  }

  if (!isLoaded) {
    return <div className="text-center">Loading Maps...</div>;
  }

  if (!selectedRecycler || !userAddress) {
    return <div className="text-red-500 text-center">Missing required data. Please go back and try again.</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto border rounded">
      <h2 className="text-2xl font-bold mb-4">Tracking Status</h2>
      <p className="mb-4">Your E-Waste pickup is in progress...</p>

      {/* Display Distance and Duration */}
      <div className="mb-4">
        <p className="text-lg font-semibold">Distance: {distance}</p>
        <p className="text-lg font-semibold">Estimated Duration: {duration}</p>
      </div>

      {/* Google Map */}
      <div className="mb-4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={mapCenter}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      {/* Display Map Error */}
      {mapError && (
        <div className="text-red-500 text-center mb-4">{mapError}</div>
      )}

      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/individual-dashboard")}
        className="bg-blue-600 text-white w-full p-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default IndividualTracking;
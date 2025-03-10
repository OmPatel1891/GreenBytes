import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // Import Firestore and Auth
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

function IndividualEwasteForm() {
  const [ewasteType, setEwasteType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  // Weight options for each e-waste type
  const weightOptions = {
    Refrigerator: [50, 75, 100, 150, 200],
    TV: [5, 10, 20, 30, 50],
    "Washing Machine": [30, 50, 70, 100, 120],
    Microwave: [10, 20, 30, 40, 50],
    Laptop: [1, 2, 3, 4, 5],
    Desktop: [5, 10, 15, 20, 25],
    Monitor: [2, 5, 7, 10, 15],
    "Mobile Phone": [0.5, 0.75, 1, 1.25, 1.5],
  };

  // Brand options for each e-waste type
  const brandOptions = {
    Refrigerator: ["LG", "Samsung", "Whirlpool", "Godrej", "Haier", "Panasonic", "Voltas", "Bosch", "Electrolux", "Other"],
    TV: ["Sony", "Samsung", "LG", "TCL", "Panasonic", "Philips", "Hisense", "Vizio", "Other"],
    "Washing Machine": ["Bosch", "IFB", "Samsung", "LG", "Whirlpool", "Panasonic", "Haier", "Godrej", "Other"],
    Microwave: ["Panasonic", "Samsung", "LG", "IFB", "Whirlpool", "Bosch", "Morphy Richards", "Other"],
    Laptop: ["Dell", "HP", "Lenovo", "Apple", "Asus", "Acer", "MSI", "Samsung", "Microsoft", "Other"],
    Desktop: ["Dell", "HP", "Lenovo", "Apple", "Acer", "Asus", "MSI", "CyberPowerPC", "Other"],
    Monitor: ["Dell", "HP", "Lenovo", "Samsung", "LG", "Acer", "Asus", "BenQ", "Other"],
    "Mobile Phone": ["Apple", "Samsung", "OnePlus", "Xiaomi", "Oppo", "Vivo", "Realme", "Google", "Motorola", "Other"],
    Chargers: ["Apple", "Samsung", "OnePlus", "Xiaomi", "Anker", "Belkin", "Sony", "Other"],
    Headphones: ["Bose", "Sony", "JBL", "Sennheiser", "Beats", "Boat", "Skullcandy", "Other"],
    Batteries: ["Exide", "Duracell", "Amaron", "Eveready", "Luminous", "Other"],
    "Circuit Boards": ["Intel", "AMD", "Nvidia", "Asus", "MSI", "Gigabyte", "Other"],
    "Cables & Wires": ["Belkin", "Zebronics", "Boat", "AmazonBasics", "Sony", "Other"],
  };

  // Condition options
  const conditionOptions = ["New", "Used - Good", "Used - Fair", "Damaged"];

  // Base prices for each e-waste type (per kg)
  const basePrices = {
    Refrigerator: 120,      
    TV: 80,               
    "Washing Machine": 100, 
    Microwave: 90,          
    Laptop: 350,          
    Desktop: 200,         
    Monitor: 150,          
    "Mobile Phone": 500,   
    Chargers: 20,
    Headphones: 30,
    Batteries: 10,
    "Circuit Boards": 10,
    "Cables & Wires": 20,
  };

  // Brand multipliers for price calculation
  const brandMultipliers = {
    Apple: 1.3,
    Samsung: 1.2,
    LG: 1.1,
    Sony: 1.3,
    Dell: 1.2,
    HP: 1.1,
    Intel: 1.2,
    AMD: 1.1,
  };

  // Condition multipliers for price calculation
  const conditionMultipliers = {
    New: 1.5,
    "Used - Good": 1.0,
    "Used - Fair": 0.7,
    Damaged: 0.4,
  };

  // Calculate the estimated price based on weight, brand, and condition
  const calculatePrice = (selectedWeight, selectedBrand, selectedCondition) => {
    if (ewasteType && basePrices[ewasteType]) {
      let basePrice = (selectedWeight || 1) * basePrices[ewasteType] * quantity;
      let brandFactor = brandMultipliers[selectedBrand] || 1;
      let conditionFactor = conditionMultipliers[selectedCondition] || 1;
      let priceInINR = basePrice * brandFactor * conditionFactor;
      setPrice(priceInINR);
    } else {
      setPrice(0);
    }
  };

  // Recalculate price whenever ewasteType, weight, brand, condition, or quantity changes
  useEffect(() => {
    calculatePrice(weight, brand, condition);
  }, [ewasteType, weight, brand, condition, quantity]);

  // Handle weight selection
  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  // Handle brand selection
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  // Handle condition selection
  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get the current user
    const user = auth.currentUser;
  
    if (!user) {
      alert("You must be logged in to submit e-waste.");
      return;
    }
  
    // Save data to Firestore
    try {
      const docRef = await addDoc(collection(db, "ewasteReports"), {
        ewasteType,
        quantity,
        weight,
        brand,
        condition,
        price,
        userId: user.uid, // Associate the submission with the user
        timestamp: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
  
      // Pass ewasteType and quantity to the next page
      navigate("/individual-recycler-suggestion", {
        state: { ewasteType, quantity }, // Pass dynamic values
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  
  // Handle "Go Back" button click
  const handleGoBack = () => {
    navigate("/individual-dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('ewasteform.jpg')" }}>
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">Report E-Waste</h2>

        {/* E-Waste Type */}
        <label className="block text-gray-700 font-semibold mb-2">Type of E-Waste</label>
        <select
          value={ewasteType}
          onChange={(e) => setEwasteType(e.target.value)}
          required
          className="w-full p-3 border rounded focus:ring-green-500"
        >
          <option value="">Select E-Waste Type</option>
          {Object.keys(brandOptions).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Quantity */}
        <label className="block text-gray-700 font-semibold mt-4 mb-2">Quantity</label>
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={handleQuantityChange}
          required
          className="w-full p-3 border rounded focus:ring-green-500"
        />

        {/* Weight (if applicable) */}
        {weightOptions[ewasteType] && (
          <>
            <label className="block text-gray-700 font-semibold mt-4 mb-2">Select Weight (kg)</label>
            <select
              value={weight}
              onChange={handleWeightChange}
              required
              className="w-full p-3 border rounded focus:ring-green-500"
            >
              <option value="">Select Weight</option>
              {weightOptions[ewasteType].map((w) => (
                <option key={w} value={w}>{w} kg</option>
              ))}
            </select>
          </>
        )}

        {/* Brand (if applicable) */}
        {brandOptions[ewasteType] && (
          <>
            <label className="block text-gray-700 font-semibold mt-4 mb-2">Select Brand</label>
            <select
              value={brand}
              onChange={handleBrandChange}
              required
              className="w-full p-3 border rounded focus:ring-green-500"
            >
              {brandOptions[ewasteType].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </>
        )}

        {/* Condition */}
        <label className="block text-gray-700 font-semibold mt-4 mb-2">Condition</label>
        <select
          value={condition}
          onChange={handleConditionChange}
          required
          className="w-full p-3 border rounded focus:ring-green-500"
        >
          {conditionOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Estimated Price */}
        {price > 0 && (
          <div className="mt-4 text-xl font-semibold text-green-700 text-center">
            Estimated Price: ₹{price.toFixed(2)}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white text-lg font-semibold py-3 mt-6 rounded hover:bg-green-700 transition duration-300"
        >
          Next
        </button>

        {/* Go Back Button */}
        <button
          type="button"
          onClick={handleGoBack}
          className="w-full bg-gray-600 text-white text-lg font-semibold py-3 mt-4 rounded hover:bg-gray-700 transition duration-300"
        >
          Go Back to Dashboard
        </button>
      </form>
    </div>
  );
}

export default IndividualEwasteForm;
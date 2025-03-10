import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, createUserWithEmailAndPassword, db, setDoc, doc } from "../firebase"; // Import Firebase functions

function Register() {
  const [userType, setUserType] = useState("individual");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!username || !email || !mobile || !password || !address.street || !address.city || !address.state || !address.postalCode || !address.country) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Firebase user registration
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data (userType, username, mobile, address) in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        mobile,
        userType,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
      });

      setRegistered(true);
      alert("Registration successful! You can now log in.");
    } catch (err) {
      setError(err.message); // Handle Firebase errors
      console.error(err.message);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/register image.jpg')" }} // Change the path as needed
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Glassmorphic Register Card */}
      <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Create Your Account
        </h2>

        {/* Display errors */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Input Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />

          {/* User Type Selection */}
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          >
            <option value="individual" className="text-black">Individual</option>
            <option value="business" className="text-black">Business</option>
          </select>

          {/* Address Fields */}
          <input
            type="text"
            placeholder="Street"
            name="street"
            value={address.street}
            onChange={handleAddressChange}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />
          <input
            type="text"
            placeholder="City"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />
          <input
            type="text"
            placeholder="State"
            name="state"
            value={address.state}
            onChange={handleAddressChange}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />
          <input
            type="text"
            placeholder="Postal Code"
            name="postalCode"
            value={address.postalCode}
            onChange={handleAddressChange}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={address.country}
            onChange={handleAddressChange}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none hover:shadow-lg"
          />

          {/* Register Button */}
          <button
            type="submit"
            className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition hover:shadow-lg"
          >
            Register
          </button>
        </form>

        {/* "Go to Login" Button */}
        {registered && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition hover:shadow-lg"
          >
            Go to Login
          </button>
        )}

        {/* Already have an account? */}
        <p className="text-center text-white mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 font-semibold cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
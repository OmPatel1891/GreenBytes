import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, db, getDoc, doc } from "../firebase"; // Import Firebase functions

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase user login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Redirect based on user type
        if (userData.userType === "individual") {
          navigate("/individual-dashboard"); // Redirect to individual dashboard
        } else if (userData.userType === "business") {
          navigate("/business-dashboard"); // Redirect to business dashboard
        }
      }
    } catch (err) {
      setError(err.message); // Handle Firebase errors
      console.error(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('login image.jpg')" }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Heading */}
      <h1 className="relative text-4xl md:text-5xl font-extrabold text-white mb-12 text-center drop-shadow-lg mt-[-40px]">
        <span className="bg-gradient-to-r from-green-400 to-green-700 text-transparent bg-clip-text">
          Welcome to GreenBytes
        </span>
      </h1>

      {/* Login Form */}
      <div className="relative bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        {/* Display errors */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Email Input */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 hover:shadow-lg hover:border-green-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 hover:shadow-lg hover:border-green-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Button */}
        <button
          onClick={() => navigate("/forgot-password")}
          className="w-full mt-4 text-center text-gray-600 hover:text-green-500 transition duration-300"
        >
          Forgot Password?
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-green-500 cursor-pointer font-semibold hover:underline"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
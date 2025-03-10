import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../firebase"; // Import Firebase functions

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      // Send a password reset email
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('login image.jpg')" }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Forgot Password Form */}
      <div className="relative bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>

        {/* Display messages */}
        {message && <div className="text-green-500 text-center mb-4">{message}</div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Email Input */}
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 hover:shadow-lg hover:border-green-500"
              required
            />
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition duration-300"
          >
            Reset Password
          </button>
        </form>

        {/* Back to Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-center text-gray-600 hover:text-green-500 transition duration-300"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
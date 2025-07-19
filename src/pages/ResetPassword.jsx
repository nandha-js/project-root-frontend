import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { LockClosedIcon } from "@heroicons/react/24/outline";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(3);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { newPassword }
      );
      setMessage(res.data.message);
      setNewPassword("");
    } catch (err) {
      setError(
        err.response && err.response.data.error
          ? err.response.data.error
          : "Something went wrong"
      );
    }
  };

  useEffect(() => {
    if (message) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [message, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">
          Reset Password
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
            {message} Redirecting in {countdown}s...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <div className="mb-8">
          <label
            htmlFor="newPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            New Password
          </label>
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300">
            <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="password"
              id="newPassword"
              className="w-full bg-transparent focus:outline-none"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition text-lg font-semibold shadow"
        >
          Reset Password
        </button>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;

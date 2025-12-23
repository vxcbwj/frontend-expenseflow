// where users can create their accounts
import React, { useState } from "react";
import { authAPI } from "../../services/api";

interface RegisterFormProps {
  onSuccess: () => void;
  onToggleToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onToggleToLogin,
}) => {
  // remembers what the user types
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  // remembers if we're waiting for the backend
  const [loading, setLoading] = useState(false);
  //remembers if something went wrong
  const [error, setError] = useState("");
  // it updates formData every time the user types something
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // sending to backend , form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent refreshing the page
    setLoading(true); // show loading spinner
    setError("");

    try {
      const response = await authAPI.register(formData); //send to backend

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        onSuccess(); // login successful  - go to next page
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  // what users see
  return (
    <div className="max-w-md mx-auto bg-accent-2 p-6 rounded-lg shadow-md dark:bg-gray-800 transition-all">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Join ExpenseFlow
      </h2>

      {error && (
        <div className="bg-accent-1 bg-opacity-20 border border-accent-1 text-accent-1 px-4 py-3 rounded-lg mb-4 transition-all animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all"
              placeholder="Last name"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all"
            placeholder="Create a password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Phone (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all"
            placeholder="Phone number"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all flex justify-center items-center"
        >
          {loading ? (
            // Show spinner when loading
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            onClick={onToggleToLogin}
            className="text-primary hover:text-opacity-80 font-medium transition-all"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;

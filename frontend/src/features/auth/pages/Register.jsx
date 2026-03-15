import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">
        
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="john123"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            Register
          </button>

        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account? 
          <Link to='/login' className="text-blue-500 cursor-pointer ml-1">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}
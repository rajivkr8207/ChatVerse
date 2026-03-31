import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { useSelector } from "react-redux";
import Button from "../../../components/common/Button";
import { toast } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  if (!loading && user) {
    return <Navigate to={'/'} replace />
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.confirmPassword != formData.password) {
      toast.error('password confirm passoword is not Matched')
      return
    }
    const res = await handleRegister(formData)
    if (res.success) {
      navigate('/login')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">

      <div className="w-full max-w-md bg-neutral-800 rounded-2xl shadow-lg p-8">

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
              className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
              required
              autoComplete="off"

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
              className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
              required
              autoComplete="off"

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
              className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
              required
              autoComplete="off"

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
              className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
              required
              autoComplete="off"

            />
          </div>
          <div>
            <label className="block text-sm mb-1">conform Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
              required
              autoComplete="off"

            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3"
          >{loading ? 'Registering..' : "Register"}</Button>

        </form>

        <p className="text-sm text-neutral-400 text-center mt-6">
          Already have an account?
          <Link to='/login' className="text-orange-500 cursor-pointer ml-1">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}
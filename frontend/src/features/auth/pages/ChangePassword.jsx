import { useState } from "react";
import useAuth from "../hook/useAuth";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate= useNavigate()
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const { handleChangePassword } = useAuth()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const res =  await handleChangePassword(formData.oldPassword, formData.newPassword)
    if(res.success){
      navigate('/profile')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">

      <div className="bg-neutral-800 p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm mb-1">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter old password"
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>
          <Button type="submit" className="w-full"> Update Password</Button>

        </form>

      </div>

    </div>
  );
}
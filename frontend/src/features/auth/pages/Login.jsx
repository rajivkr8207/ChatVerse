import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hook/useAuth";

export default function Login() {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const { handleLogin } = useAuth()
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(formData)
        // console.log(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-center mb-6">
                    Login Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm mb-1">Username or email</label>
                        <input
                            type="text"
                            name="identifier"
                            placeholder="john123"
                            value={formData.identifier}
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
                        Login
                    </button>

                </form>

                <p className="text-sm text-gray-400 text-center mt-6">
                    Not have an account?
                    <Link to='/register' className="text-blue-500 cursor-pointer ml-1">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}
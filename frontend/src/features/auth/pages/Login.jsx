import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { useSelector } from "react-redux";
import Button from "../../../components/common/Button";

export default function Login() {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const { handleLogin } = useAuth()
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.auth.loading)

    if (!loading && user) {
        return <Navigate to={'/'} replace />
    }
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(formData)
    };


    return (
        <div className="min-h-screen flex items-center justify-center text-white">

            <div className="w-full max-w-md bg-neutral-800 rounded-2xl shadow-lg p-8">

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
                            className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
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
                            className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3"
                    >{loading ? 'loading..' : "Login"}</Button>
                </form>

                <p className="text-sm text-neutral-400 text-center mt-6">
                   Resend verify mail?
                    <Link to='/resend/verifyemail' className="text-orange-500 cursor-pointer ml-1">
                        resend email
                    </Link>
                </p>
<p className="text-sm text-neutral-400 text-center mt-6">
                    Not have an account?
                    <Link to='/register' className="text-orange-500 cursor-pointer ml-1">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}
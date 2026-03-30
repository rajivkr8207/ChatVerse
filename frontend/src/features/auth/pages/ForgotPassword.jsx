import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { useSelector } from "react-redux";
import Button from "../../../components/common/Button";

export default function ForgotPassword() {
    const [email, setemail] = useState('');
    const { handleForgotPassword } = useAuth()
    const loading = useSelector((state) => state.auth.loading)

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await handleForgotPassword(email)
        if (res.success) {
            navigate('/login')
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center text-white">

            <div className="w-full max-w-md bg-neutral-800 rounded-2xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-center mb-6">
                    Forgot Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm mb-1">email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="john123"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3"
                    >{loading ? 'verifying...' : "verify mail"}</Button>
                </form>

                <p className="text-sm text-neutral-400 text-center mt-6">
                    already have an account?
                    <Link to='/login' className="text-orange-500 cursor-pointer ml-1">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { useSelector } from "react-redux";
import Button from "../../../components/common/Button";
import { toast } from "react-toastify";

export default function VerifyForgotPassword() {
    const { token } = useParams()
    const [password, setpassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const { handleForgotPasswordVerify } = useAuth()
    const loading = useSelector((state) => state.auth.loading)

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return;
        if (password !== confirmPassword) {
            return toast.error("password and confirm password must be same")
        }
        const res = await handleForgotPasswordVerify(token, { newPassword: password })
        if (res.success) {
            navigate('/login')
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center text-white">

            <div className="w-full max-w-md bg-neutral-800 rounded-2xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-center mb-6">
                    verify Forgot Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm mb-1">password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="john123"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="john123"
                            value={confirmPassword}
                            onChange={(e) => setconfirmPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 focus:outline-none focus:border-orange-500"
                            required
                            autoComplete="off"

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
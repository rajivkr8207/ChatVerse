import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";
import { useSelector } from "react-redux";

export default function Profile() {
    const navigate = useNavigate()
    const userdata = useSelector(state => state.auth.user)

    return (
        <div className="min-h-screen  text-white flex justify-center items-center p-6">

            <div className="w-full max-w-3xl bg-neutral-800 rounded-2xl shadow-lg p-8">

                {/* Profile Header */}
                <div className="flex items-center space-x-6 border-b border-neutral-700 pb-6">

                    <div>
                        <h1 className="text-2xl font-bold">{userdata?.fullName}</h1>
                        <p className="text-neutral-400">@{userdata?.username}</p>
                    </div>

                </div>

                {/* Profile Details */}
                <div className="mt-6 space-y-4">

                    <div className="flex justify-between border-b border-neutral-700 pb-3">
                        <span className="text-neutral-400">Full Name</span>
                        <span>{userdata?.fullName}</span>
                    </div>

                    <div className="flex justify-between border-b border-neutral-700 pb-3">
                        <span className="text-neutral-400">Username</span>
                        <span>@{userdata?.username}</span>
                    </div>

                    <div className="flex justify-between border-b border-neutral-700 pb-3">
                        <span className="text-neutral-400">Email</span>
                        <span>{userdata?.email}</span>
                    </div>

                    <div className="flex justify-between border-b border-neutral-700 pb-3">
                        <span className="text-neutral-400">Joined</span>
                        <span>{userdata?.createdAt?.split('T')[0]}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-700 pb-3">
                        <span className="text-neutral-400">Login With</span>
                        <span>{userdata?.provider}</span>
                    </div>
                </div>

                {/* Button */}
                <div className="flex justify-between mt-8">
                    {userdata?.provider === "email" && (
                        <Button onClick={() => navigate('/change-password')} >change password</Button>
                    )}
                    <Button onClick={() => navigate('/')} >Home</Button>

                </div>

            </div>

        </div>
    );
}
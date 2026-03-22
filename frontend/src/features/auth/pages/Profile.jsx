import React, { useEffect } from "react";
import useAuth from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate()
    const { userdata, handleProfile } = useAuth()

    useEffect(() => {
        handleProfile()
    }, [])


    return (
        <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">

            <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-lg p-8">

                {/* Profile Header */}
                <div className="flex items-center space-x-6 border-b border-gray-700 pb-6">

                    <div>
                        <h1 className="text-2xl font-bold">{userdata?.fullName}</h1>
                        <p className="text-gray-400">@{userdata?.username}</p>
                    </div>

                </div>

                {/* Profile Details */}
                <div className="mt-6 space-y-4">

                    <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Full Name</span>
                        <span>{userdata?.fullName}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Username</span>
                        <span>@{userdata?.username}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Email</span>
                        <span>{userdata?.email}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Joined</span>
                        <span>{userdata?.createdAt.split('T')[0]}</span>
                    </div>

                </div>

                {/* Button */}
                <div onClick={() => navigate('/change-password')} className="mt-8">
                    <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">
                        Change passowrd
                    </button>
                </div>

            </div>

        </div>
    );
}
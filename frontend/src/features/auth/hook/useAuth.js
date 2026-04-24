import { useDispatch } from "react-redux"
import { setError, setLoading, setUser } from "../auth.slice"
import { ForgotPassword, ForgotPasswordVerify, LoginUser, RegisterUser, UserChangePassowrd, UserGetMe, Userlogout, UserProfie, VerifyEmailSendAgain } from "../services/auth.service"
import { toast } from "react-toastify"
import { useState } from "react"



const useAuth = () => {
    const dispatch = useDispatch()
    // const navigate = useNavigate()


    const handleRegister = async ({ fullName, username, email, password }) => {
        try {
            dispatch(setLoading(true))
            const res = await RegisterUser({ fullName, username, email, password })
            toast.success('Register successfully')
            console.log(res);
            return res
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);
            dispatch(setError(message));
        } finally {
            dispatch(setLoading(false))

        }
    }
    const handleLogin = async ({ identifier, password }) => {
        try {
            dispatch(setLoading(true))
            const res = await LoginUser({ identifier, password })
            toast.success(res.message)
            dispatch(setUser(res.data))
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);
            dispatch(setError(message));
        } finally {
            dispatch(setLoading(false))
        }
    }


    const handleGetme = async () => {
        try {
            dispatch(setLoading(true))
            const res = await UserGetMe()
            dispatch(setUser(res.data))
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setLoading(false))
        }
    }


    const handleProfile = async () => {
        try {
            const res = await UserProfie()
            dispatch(setUser(res.data))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registeration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handlelogout = async () => {
        try {
            const res = await Userlogout()
            toast.success(res.message)
            dispatch(setUser(null))
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);
            dispatch(setError(message));

        }
    }

    const handleChangePassword = async (oldPassword, newPassword) => {
        try {
            const res = await UserChangePassowrd({ oldPassword, newPassword })
            toast.success(res.message)
            return res
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);
            dispatch(setError(message));
            console.error(error);
        }
    }

    const handleForgotPassword = async (email) => {
        try {
            const res = await ForgotPassword({ email: email })
            toast.success(res.message)
            return res
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);
            dispatch(setError(message));
            console.error(error);
        }
    }
    const handleForgotPasswordVerify = async (token, { newPassword }) => {
        try {
            const res = await ForgotPasswordVerify(token, { newPassword })
            toast.success(res.message)
            return res
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);
            dispatch(setError(message));
            console.error(error);
        }
    }
    const handleEmailSendAgian = async (email) => {
        try {
            const res = await VerifyEmailSendAgain(email);

            toast.success(res.message || "Verification email sent");
            return res;

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);
            dispatch(setError(message));
            console.error(error);
        }
    };
    return { handleRegister, handleForgotPassword, handleForgotPasswordVerify, handleEmailSendAgian, handlelogout, handleLogin, handleGetme, handleProfile, handleChangePassword }
}

export default useAuth
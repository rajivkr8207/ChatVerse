import { useDispatch } from "react-redux"
import { setError, setLoading, setUser } from "../auth.slice"
import { LoginUser, RegisterUser, UserChangePassowrd, UserGetMe, UserProfie } from "../services/auth.service"
import { toast } from "react-toastify"
import {  useState } from "react"



const useAuth = () => {
    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const [userdata, setUserdata] = useState(null)


    const handleRegister = async ({ fullName, username, email, password }) => {
        try {
            dispatch(setLoading(true))
            const res = await RegisterUser({ fullName, username, email, password })
            console.log(res);
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registeration failed"))
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
            dispatch(setError(error.response?.data?.message || "Registeration failed"))
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
            dispatch(setError(error.response?.data?.message || "Registeration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }


    const handleProfile = async () => {
        try {
            dispatch(setLoading(true))
            const res = await UserProfie()
            setUserdata(res.data)
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registeration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleChangePassword = async (oldPassword, newPassword) => {
        try {
            const res = await UserChangePassowrd({ oldPassword, newPassword })
            toast.success(res.message)
            // navigate('/')
        } catch (error) {
            console.error(error);
        }
    }



    return { handleRegister, handleLogin, handleGetme, handleProfile, handleChangePassword,userdata ,setUserdata}
}

export default useAuth
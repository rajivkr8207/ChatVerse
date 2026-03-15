import { useDispatch } from "react-redux"
import { setError, setLoading, setUser } from "../auth.slice"
import { LoginUser, RegisterUser, UserGetMe } from "../services/auth.service"
import { toast } from "react-toastify"


const useAuth = () => {
    const dispatch = useDispatch()

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
            console.log(res);
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
            console.log(res);
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registeration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }
    return { handleRegister, handleLogin, handleGetme }
}

export default useAuth
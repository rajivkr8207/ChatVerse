import { RouterProvider } from "react-router-dom"
import { Router } from "./app.routes"
import { store } from "./app.store"
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { useEffect, useState } from "react"
import useAuth from "../features/auth/hook/useAuth"
import LoadingScreen from "../components/common/LoadingScreen"

const App = () => {
    const { handleGetme } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        handleGetme()
    }, [])

    return (
        <>
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
            <Provider store={store}>
                <RouterProvider router={Router} />
                <ToastContainer />
            </Provider>
        </>
    )
}

export default App
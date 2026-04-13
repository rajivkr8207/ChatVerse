import { RouterProvider } from "react-router-dom"
import { Router } from "./app.routes"
import { store } from "./app.store"
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { useEffect, useState } from "react"
import useAuth from "../features/auth/hook/useAuth"
import LoadingScreen from "../components/common/LoadingScreen"
import ThemeProvider from "./ThemeProvider"

const App = () => {
    const { handleProfile } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        handleProfile()
    }, [])

    return (
        <>
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
            <Provider store={store}>
                <ThemeProvider>
                    <RouterProvider router={Router} />
                    <ToastContainer />
                </ThemeProvider>
            </Provider>
        </>
    )
}

export default App
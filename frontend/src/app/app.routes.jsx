import { createBrowserRouter } from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <h1>dashboard</h1>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
])
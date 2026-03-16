import { createBrowserRouter } from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import Profile from "../features/auth/pages/Profile"
import ChangePassword from "../features/auth/pages/ChangePassword"
import Home from "../features/chat/pages/Home"
import Protected from "../features/auth/components/protected"

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
            <Home />
        </Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/profile",
        element: <Protected>
            <Profile />
        </Protected>
    },
    {
        path: "/change-password",
        element: <Protected>
            <ChangePassword />
        </Protected>
    },
])
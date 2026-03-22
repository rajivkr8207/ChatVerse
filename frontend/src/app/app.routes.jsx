import { createBrowserRouter } from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import Profile from "../features/auth/pages/Profile"
import ChangePassword from "../features/auth/pages/ChangePassword"
import Protected from "../features/auth/components/protected"
import Dashboard from "../features/chat/pages/Dashboard"
import Chat from "../features/chat/pages/Chat"

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
            <Dashboard />
        </Protected>,
        children: [
            {
                path: "chat/:chatid",
                element: <Protected>
                    <Chat />
                </Protected>
            }
        ]
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
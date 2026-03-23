import { RouterProvider } from "react-router-dom"
import { Router } from "./app.routes"
import { store } from "./app.store"
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { useEffect } from "react"
import useAuth from "../features/auth/hook/useAuth"
const App = () => {
const {handleGetme} = useAuth()

    useEffect(() => {
        handleGetme()
    }, [])

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={Router} />
        <ToastContainer />
      </Provider>
    </>
  )
}

export default App
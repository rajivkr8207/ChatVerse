import { RouterProvider } from "react-router-dom"
import { Router } from "./app.routes"
import { store } from "./app.store"
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
const App = () => {
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
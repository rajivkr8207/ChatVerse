import { Provider } from 'react-redux'
import AppRouter from './routes/AppRouter'
import { store } from './stores/store'
import ThemeProvider from './providers/ThemeProvider'

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </Provider>
  )
}

export default App
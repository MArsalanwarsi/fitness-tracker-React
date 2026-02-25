import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@/components/theme-provider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <Provider store={store}>
    <App />
    </Provider>
    </ThemeProvider>
  </StrictMode>
)

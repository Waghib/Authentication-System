import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'

ReactDOM.createRoot(document.getElementById('app')).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
) 
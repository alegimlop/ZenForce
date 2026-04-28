import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//nicializa la aplicación de React renderizando el
//  componente principal (App) en el elemento raíz del HTML,
//  utilizando StrictMode para detectar posibles problemas durante el desarrollo.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

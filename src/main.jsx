import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './data-components.css'
import './v4.css'
import './mission-process.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
)

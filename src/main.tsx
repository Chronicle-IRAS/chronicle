import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import './styles/globals.css'
import '@xyflow/react/dist/style.css'
import './styles/opening.css'
import './styles/interactions.css'
import './styles/editorial.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

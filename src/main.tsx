import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { mountJourneyAtEntry } from './app/prepareJourneyEntry'
import './styles/globals.css'
import '@xyflow/react/dist/style.css'
import './styles/opening.css'
import './styles/interactions.css'
import './styles/editorial.css'
import './styles/ink.css'
import './styles/polish.css'
import './styles/composer-dream.css'
import './styles/expression.css'

mountJourneyAtEntry(window, () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { OS } from './os/OS'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OS />
  </StrictMode>,
)

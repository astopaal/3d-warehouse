import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// React DevTools semver hatası için workaround (React 19 uyumsuzluğu)
// Bu hata uygulamayı etkilemez, sadece console'u temizler
if (typeof window !== 'undefined') {
  const originalError = console.error
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not valid semver')
    ) {
      return
    }
    originalError.apply(console, args)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

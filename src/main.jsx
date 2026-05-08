import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode removed: in dev it double-invokes all effects, causing back-to-back
// ISS API calls that immediately hit wheretheiss.at's rate limit (429).
createRoot(document.getElementById('root')).render(<App />)

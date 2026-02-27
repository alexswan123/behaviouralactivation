import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import posthog from 'posthog-js'
import './index.css'
import App from './App.tsx'

inject()

// Initialise PostHog — same singleton used by analytics.ts
if (import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    defaults: '2026-01-30' as const,
    person_profiles: 'identified_only' as const,
    disable_session_recording: true,
    capture_performance: false,
  })

  // Tag owner sessions for filtering in PostHog.
  // To activate: run localStorage.setItem('is_owner', 'true') once in browser console.
  if (localStorage.getItem('is_owner')) {
    posthog.identify('owner-alexandra', { is_owner: true })
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

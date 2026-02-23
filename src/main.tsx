import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import { PostHogProvider } from '@posthog/react'
import './index.css'
import App from './App.tsx'

inject()

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2026-01-30' as const,
  // Only create person profiles when explicitly identified — no persistent tracking
  person_profiles: 'identified_only' as const,
  // Disable session recording — too privacy-sensitive for a mental health tool
  disable_session_recording: true,
  // Don't capture performance metrics / exceptions automatically
  capture_performance: false,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={posthogOptions}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)

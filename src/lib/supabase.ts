import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Anonymous session management
const SESSION_KEY = 'ba_session_id';

export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export async function ensureSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('user_sessions')
    .upsert({ id: sessionId }, { onConflict: 'id', ignoreDuplicates: true });
  if (error) {
    console.error('Failed to ensure session:', error);
  }
}

const SCHEDULE_KEY = 'ba_schedule_id';

export function getStoredScheduleId(): string | null {
  return localStorage.getItem(SCHEDULE_KEY);
}

export function storeScheduleId(id: string): void {
  localStorage.setItem(SCHEDULE_KEY, id);
}

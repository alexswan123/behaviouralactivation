export type Category = 'pleasure' | 'social' | 'achievement' | 'body';
export type Context = 'home' | 'outdoors' | 'social' | 'anywhere';
export type Effort = 'low' | 'medium' | 'high';

export interface CatalogueActivity {
  id: string;
  name: string;
  description: string;
  category: Category;
  group: string;
  context: Context;
  effort: Effort;
  /** Hidden sort score (1-10). Lower = easier. Used for ordering within effort tiers. */
  effortScore: number;
  durationMinutes?: number;
}

export interface ACEScores {
  achievement: number | null;
  connection: number | null;
  enjoyment: number | null;
}

export interface ScheduledActivity {
  id: string;
  schedule_id: string;
  day_number: number;
  scheduled_date: string; // ISO date string
  scheduled_time: string; // HH:MM
  activity_name: string;
  catalogue_id: string | null;
  category: Category | null;
  pre_achievement: number | null;
  pre_connection: number | null;
  pre_enjoyment: number | null;
  post_achievement: number | null;
  post_connection: number | null;
  post_enjoyment: number | null;
  pre_depression: number | null;
  post_depression: number | null;
  completed: boolean;
  notes: string | null;
  created_at: string;
}

export interface Schedule {
  id: string;
  session_id: string;
  start_date: string; // ISO date string
  duration: number;   // number of days (default 10)
  created_at: string;
}

export interface UserSession {
  id: string;
  created_at: string;
}

export interface PastActivity {
  id: string;
  text: string;
  created_at: string;
}

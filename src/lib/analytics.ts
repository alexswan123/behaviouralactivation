import posthog from 'posthog-js';

// ── Safe event helpers ────────────────────────────────────────────────────────
// Rule: never capture activity names, ACE scores, notes, or any user-typed text.
// Only capture structural metadata (category, duration, feature used).

export const track = {
  /** User clicked "Start my programme" and it was created */
  programmeCreated(duration: number) {
    posthog.capture('programme_created', { duration });
  },

  /** Returning user clicked "Continue my programme" */
  programmeContinued() {
    posthog.capture('programme_continued');
  },

  /** An activity was added to the schedule */
  activityAdded(opts: { source: 'catalogue' | 'custom' | 'past'; category: string | null }) {
    posthog.capture('activity_added', opts);
  },

  /** An activity was marked complete */
  activityCompleted(opts: { category: string | null }) {
    posthog.capture('activity_completed', opts);
  },

  /** An activity was deleted */
  activityDeleted() {
    posthog.capture('activity_deleted');
  },

  /** Export modal opened */
  exportOpened() {
    posthog.capture('export_opened');
  },

  /** User downloaded PDF */
  exportPdfDownloaded() {
    posthog.capture('export_pdf_downloaded');
  },

  /** User downloaded ICS calendar file */
  exportIcsDownloaded() {
    posthog.capture('export_ics_downloaded');
  },

  /** User downloaded .txt file */
  exportTxtDownloaded() {
    posthog.capture('export_txt_downloaded');
  },

  /** User copied schedule text */
  exportTextCopied() {
    posthog.capture('export_text_copied');
  },

  /** User triggered mailto email */
  exportEmailSent() {
    posthog.capture('export_email_sent');
  },

  /** User filtered catalogue by category */
  catalogueCategoryFiltered(category: string) {
    posthog.capture('catalogue_category_filtered', { category });
  },

  /** User cleared all planned activities (kept start date) */
  scheduleResetActivities() {
    posthog.capture('schedule_reset_activities');
  },

  /** User did a full programme reset */
  scheduleResetFull() {
    posthog.capture('schedule_reset_full');
  },

  /** User changed programme length */
  programmeLengthChanged(opts: { from: number; to: number }) {
    posthog.capture('programme_length_changed', opts);
  },

  /** User enabled activity reminders */
  remindersEnabled() {
    posthog.capture('reminders_enabled');
  },

  /** User disabled activity reminders */
  remindersDisabled() {
    posthog.capture('reminders_disabled');
  },
};

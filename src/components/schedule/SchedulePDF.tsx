import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Schedule, ScheduledActivity } from '../../lib/types';
import { spell } from '../../lib/spelling';

// Built-in PDF font families — no network requests, always available.
// Helvetica       = regular
// Helvetica-Bold  = bold

const C = {
  forest:          '#3D5A4C',
  sage:            '#7D9B76',
  sageMid:         '#A8C8B0',
  sagePale:        '#D8EDD8',
  cream:           '#FAF6F0',
  creamDark:       '#F0E8DC',
  border:          '#E0D8CE',
  borderLight:     '#EDE8E0',
  text:            '#2A3D32',
  muted:           '#7A7775',
  white:           '#FFFFFF',
  liftPos:         '#5C8F6A',
  liftNeg:         '#C17C5A',
  pleasureBg:      '#FDE8E8',  pleasureText:    '#9B3A45',
  socialBg:        '#D8EDD8',  socialText:      '#2D5A3A',
  achievementBg:   '#FFF0DC',  achievementText: '#7B4A10',
  bodyBg:          '#DCE8F5',  bodyText:        '#1A3A6B',
};

const catColour: Record<string, { bg: string; fg: string }> = {
  pleasure:    { bg: C.pleasureBg,    fg: C.pleasureText },
  social:      { bg: C.socialBg,      fg: C.socialText },
  achievement: { bg: C.achievementBg, fg: C.achievementText },
  body:        { bg: C.bodyBg,        fg: C.bodyText },
};

// Convenience aliases
const REG  = 'Helvetica';
const BOLD = 'Helvetica-Bold';

const s = StyleSheet.create({
  page: {
    fontFamily: REG,
    fontSize: 9,
    backgroundColor: C.cream,
    paddingHorizontal: 36,
    paddingTop: 36,
    paddingBottom: 52,
    color: C.text,
  },

  // ── Cover header ──
  coverHeader: {
    backgroundColor: C.forest,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 22,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  coverTitle: { fontFamily: BOLD, fontSize: 24, color: C.white },
  coverSubtitle: { fontFamily: REG, fontSize: 10, color: C.sageMid, marginTop: 3 },
  coverMetaLabel: { fontFamily: REG, fontSize: 7.5, color: C.sageMid, textTransform: 'uppercase', letterSpacing: 0.5 },
  coverMetaValue: { fontFamily: BOLD, fontSize: 10, color: C.white, marginTop: 3 },

  // ── Stats row ──
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statBox: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statValue: { fontFamily: BOLD, fontSize: 18, color: C.forest },
  statValuePos: { color: C.sage },
  statLabel: { fontFamily: REG, fontSize: 7.5, color: C.muted, marginTop: 2 },

  // ── Section heading ──
  sectionHeading: {
    fontFamily: BOLD,
    fontSize: 7.5,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 2,
  },

  // ── Day card ──
  dayCard: {
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 8,
    overflow: 'hidden',
  },
  dayCardHighlight: { borderColor: C.sage, borderWidth: 1.5 },

  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: C.creamDark,
  },
  dayHeaderToday: { backgroundColor: C.sage },

  dayNumber: { fontFamily: BOLD, fontSize: 10, color: C.forest },
  dayNumberToday: { color: C.white },
  dayDate: { fontFamily: REG, fontSize: 8.5, color: C.muted },
  dayDateToday: { color: C.sagePale },
  todayPill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  todayPillText: { fontFamily: BOLD, fontSize: 7, color: C.white },
  doneBadge: { fontFamily: BOLD, fontSize: 7.5 },

  // ── Activity body ──
  activityBody: { paddingHorizontal: 12, paddingVertical: 10 },
  activityName: { fontFamily: BOLD, fontSize: 10, color: C.text, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  timeText: { fontFamily: REG, fontSize: 8, color: C.muted },
  catPill: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  catPillText: { fontFamily: BOLD, fontSize: 7 },
  completedPill: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: C.sagePale },
  completedPillText: { fontFamily: BOLD, fontSize: 7, color: C.socialText },

  // ── ACE table ──
  aceTable: { borderRadius: 6, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 2 },
  aceHeaderRow: { flexDirection: 'row', backgroundColor: C.creamDark },
  aceDataRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.border },

  // Cells
  aceLabelCol: { width: 72, paddingHorizontal: 8, paddingVertical: 6, justifyContent: 'center', borderRightWidth: 1, borderRightColor: C.border },
  aceLabelText: { fontFamily: BOLD, fontSize: 8, color: C.forest },
  aceHeaderCol: { flex: 1, paddingHorizontal: 8, paddingVertical: 5, borderRightWidth: 1, borderRightColor: C.border, justifyContent: 'center' },
  aceHeaderColLast: { borderRightWidth: 0 },
  aceHeaderText: { fontFamily: BOLD, fontSize: 7, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4 },
  aceScoreCol: { flex: 1, paddingHorizontal: 8, paddingVertical: 6, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: C.border },
  aceScoreColLast: { borderRightWidth: 0 },
  aceScoreNum: { fontFamily: BOLD, fontSize: 13, color: C.forest },
  aceScoreNumEmpty: { color: C.borderLight },
  aceScoreSubLabel: { fontFamily: REG, fontSize: 6.5, color: C.muted, marginTop: 1 },
  liftPos: { color: C.liftPos },
  liftNeg: { color: C.liftNeg },

  // ── Blank printable score box (fill in by hand) ──
  blankScoreBox: {
    width: 22,
    height: 17,
    borderWidth: 1,
    borderColor: '#C8C3BC',
    borderRadius: 3,
    marginBottom: 2,
  },

  // ── Wellbeing before/after section ──
  wellbeingCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  wellbeingHeader: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: C.creamDark },
  wellbeingHeaderText: { fontFamily: BOLD, fontSize: 8.5, color: C.forest },
  wellbeingBody: { paddingHorizontal: 12, paddingVertical: 10 },
  wellbeingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  wellbeingLabel: { fontFamily: REG, fontSize: 8, color: C.text },
  wellbeingField: { width: 30, height: 18, borderWidth: 1, borderColor: C.border, borderRadius: 3 },
  wellbeingSlash: { fontFamily: REG, fontSize: 8, color: C.muted, marginHorizontal: 2 },
  wellbeingPrompt: { fontFamily: BOLD, fontSize: 7.5, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 8, marginBottom: 5 },
  wellbeingTextLine: { borderBottomWidth: 0.75, borderBottomColor: C.borderLight, marginBottom: 9 },
  wellbeingDateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  wellbeingDateLabel: { fontFamily: BOLD, fontSize: 7.5, color: C.muted },
  wellbeingDateField: { flex: 1, height: 16, borderBottomWidth: 1, borderBottomColor: C.border },

  // ── Notes ──
  notesBox: { backgroundColor: C.cream, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 6, marginTop: 4 },
  notesLabel: { fontFamily: BOLD, fontSize: 7, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 },
  notesText: { fontFamily: REG, fontSize: 8, color: C.text, lineHeight: 1.5 },

  // ── Empty day ──
  emptyDay: { paddingHorizontal: 12, paddingVertical: 10 },
  emptyDayText: { fontFamily: REG, fontSize: 8, color: C.border, fontStyle: 'italic' },

  // ── Divider ──
  divider: { height: 1, backgroundColor: C.borderLight, marginVertical: 8 },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 24, left: 36, right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 7,
  },
  footerBrand: { fontFamily: BOLD, fontSize: 8, color: C.sage },
  footerText: { fontFamily: REG, fontSize: 7.5, color: C.muted },
  footerPage: { fontFamily: REG, fontSize: 7.5, color: C.muted },

  // ── Depression score page ──
  phqBox: {
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  phqBoxHeader: {
    backgroundColor: C.forest,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  phqBoxHeaderText: { fontFamily: BOLD, fontSize: 9.5, color: C.white },
  phqBoxHeaderSub: { fontFamily: REG, fontSize: 7.5, color: C.sageMid, marginTop: 2 },
  phqBoxBody: { paddingHorizontal: 14, paddingVertical: 12 },

  // PHQ-9 scale bar
  scaleRow: { flexDirection: 'row', gap: 0, marginBottom: 4 },
  scaleBand: { flex: 1, paddingVertical: 6, alignItems: 'center' },
  scaleBandText: { fontFamily: BOLD, fontSize: 7, color: C.white },
  scaleBandSub: { fontFamily: REG, fontSize: 6, color: C.white, marginTop: 1, opacity: 0.85 },

  // Score input fields (printed blanks)
  scoreFieldRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  scoreField: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  scoreFieldLabel: { fontFamily: BOLD, fontSize: 7.5, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
  scoreFieldValue: { fontFamily: BOLD, fontSize: 22, color: C.borderLight },
  scoreFieldHint: { fontFamily: REG, fontSize: 7, color: C.borderLight, marginTop: 2 },

  // Insights
  insightCard: {
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  insightHeader: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: C.creamDark,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightHeaderText: { fontFamily: BOLD, fontSize: 8.5, color: C.forest },
  insightBody: { paddingHorizontal: 12, paddingVertical: 10 },
  insightBodyText: { fontFamily: REG, fontSize: 8.5, color: C.text, lineHeight: 1.6 },
  insightBold: { fontFamily: BOLD, fontSize: 8.5, color: C.text },

  // Recommendation bullets
  bulletRow: { flexDirection: 'row', gap: 6, marginBottom: 5 },
  bullet: { fontFamily: BOLD, fontSize: 9, color: C.sage, width: 10 },
  bulletText: { fontFamily: REG, fontSize: 8.5, color: C.text, flex: 1, lineHeight: 1.5 },

  // Clinician notes area
  notesArea: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    minHeight: 90,
  },
  notesAreaLabel: { fontFamily: BOLD, fontSize: 7.5, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 },
  notesLine: { borderBottomWidth: 0.75, borderBottomColor: C.borderLight, marginBottom: 12 },

  // Two-column layout
  twoCol: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  col: { flex: 1 },
});

// ─── Small components ────────────────────────────────────────────────────────

function AceScore({ value, sub }: { value: number | null; sub: string }) {
  return (
    <View style={[s.aceScoreCol]}>
      {value === null
        ? <View style={s.blankScoreBox} />
        : <Text style={s.aceScoreNum}>{String(value)}</Text>
      }
      <Text style={s.aceScoreSubLabel}>{sub}</Text>
    </View>
  );
}

function AceLift({ pre, post, sub }: { pre: number | null; post: number | null; sub: string }) {
  const valid = pre !== null && post !== null;
  const lift = valid ? post! - pre! : null;
  return (
    <View style={[s.aceScoreCol, s.aceScoreColLast]}>
      {!valid
        ? <View style={s.blankScoreBox} />
        : <Text style={[s.aceScoreNum, lift! > 0 ? s.liftPos : lift! < 0 ? s.liftNeg : {}]}>
            {lift! > 0 ? `+${lift}` : String(lift)}
          </Text>
      }
      <Text style={s.aceScoreSubLabel}>{sub}</Text>
    </View>
  );
}

function ActivityBlock({ act }: { act: ScheduledActivity }) {
  const cat = act.category ? catColour[act.category] : null;
  const hasPre  = act.pre_achievement  !== null || act.pre_connection  !== null || act.pre_enjoyment  !== null;
  const hasPost = act.post_achievement !== null || act.post_connection !== null || act.post_enjoyment !== null;
  const showLift = hasPre && hasPost;
  const catLabel = act.category ? act.category.charAt(0).toUpperCase() + act.category.slice(1) : null;

  return (
    <View>
      <Text style={s.activityName}>{act.activity_name}</Text>
      <View style={s.metaRow}>
        <Text style={s.timeText}>{act.scheduled_time}</Text>
        {cat && catLabel && (
          <View style={[s.catPill, { backgroundColor: cat.bg }]}>
            <Text style={[s.catPillText, { color: cat.fg }]}>{catLabel}</Text>
          </View>
        )}
        {act.completed && (
          <View style={s.completedPill}><Text style={s.completedPillText}>✓ Completed</Text></View>
        )}
      </View>

      {(hasPre || hasPost) && (
        <View style={s.aceTable}>
          {/* Column headers */}
          <View style={s.aceHeaderRow}>
            <View style={[s.aceHeaderCol, { width: 72, flex: 0 }]}><Text style={s.aceHeaderText}> </Text></View>
            {hasPre  && <View style={s.aceHeaderCol}><Text style={s.aceHeaderText}>Expected</Text></View>}
            {hasPost && <View style={s.aceHeaderCol}><Text style={s.aceHeaderText}>Actual</Text></View>}
            {showLift && <View style={[s.aceHeaderCol, s.aceHeaderColLast]}><Text style={s.aceHeaderText}>Lift</Text></View>}
          </View>

          {/* Achievement row */}
          <View style={s.aceDataRow}>
            <View style={s.aceLabelCol}><Text style={s.aceLabelText}>Achievement</Text></View>
            {hasPre  && <AceScore value={act.pre_achievement}  sub="A" />}
            {hasPost && <AceScore value={act.post_achievement} sub="A" />}
            {showLift && <AceLift pre={act.pre_achievement} post={act.post_achievement} sub="A" />}
          </View>

          {/* Connection row */}
          <View style={s.aceDataRow}>
            <View style={s.aceLabelCol}><Text style={s.aceLabelText}>Connection</Text></View>
            {hasPre  && <AceScore value={act.pre_connection}  sub="C" />}
            {hasPost && <AceScore value={act.post_connection} sub="C" />}
            {showLift && <AceLift pre={act.pre_connection} post={act.post_connection} sub="C" />}
          </View>

          {/* Enjoyment row */}
          <View style={s.aceDataRow}>
            <View style={s.aceLabelCol}><Text style={s.aceLabelText}>Enjoyment</Text></View>
            {hasPre  && <AceScore value={act.pre_enjoyment}  sub="E" />}
            {hasPost && <AceScore value={act.post_enjoyment} sub="E" />}
            {showLift && <AceLift pre={act.pre_enjoyment} post={act.post_enjoyment} sub="E" />}
          </View>
        </View>
      )}

      {act.notes && (
        <View style={s.notesBox}>
          <Text style={s.notesLabel}>Notes</Text>
          <Text style={s.notesText}>{act.notes}</Text>
        </View>
      )}
    </View>
  );
}

function DayBlock({ dayNumber, dateStr, activities }: { dayNumber: number; dateStr: string; activities: ScheduledActivity[] }) {
  const date  = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const weekday  = date.toLocaleDateString('en-AU', { weekday: 'short' });
  const dateDisp = date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  const doneCount = activities.filter(a => a.completed).length;

  return (
    <View style={[s.dayCard, isToday ? s.dayCardHighlight : {}]}>
      <View style={[s.dayHeader, isToday ? s.dayHeaderToday : {}]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[s.dayNumber, isToday ? s.dayNumberToday : {}]}>Day {dayNumber}</Text>
          <Text style={[s.dayDate, isToday ? s.dayDateToday : {}]}>{weekday} {dateDisp}</Text>
          {isToday && <View style={s.todayPill}><Text style={s.todayPillText}>Today</Text></View>}
        </View>
        {activities.length > 0 && (
          <Text style={[s.doneBadge, { color: isToday ? C.sagePale : C.muted }]}>
            {doneCount}/{activities.length} done
          </Text>
        )}
      </View>

      {activities.length === 0 ? (
        <View style={s.emptyDay}><Text style={s.emptyDayText}>No activity planned</Text></View>
      ) : (
        <View style={s.activityBody}>
          {activities.map((act, i) => (
            <View key={act.id}>
              {i > 0 && <View style={s.divider} />}
              <ActivityBlock act={act} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Document ─────────────────────────────────────────────────────────────────

interface SchedulePDFProps {
  schedule: Schedule;
  activities: ScheduledActivity[];
}

export default function SchedulePDF({ schedule, activities }: SchedulePDFProps) {
  const startDate = new Date(schedule.start_date + 'T00:00:00');
  const endDate   = new Date(startDate);
  endDate.setDate(endDate.getDate() + 9);

  const fmt = (d: Date) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const startLabel   = fmt(startDate);
  const endLabel     = fmt(endDate);
  const exportedLabel = fmt(new Date());

  const completedActivities = activities.filter(a => a.completed);
  const completedCount = completedActivities.length;
  const totalPlanned   = activities.length;

  const avgLift = (preKey: keyof ScheduledActivity, postKey: keyof ScheduledActivity): string | null => {
    const valid = completedActivities.filter(a => a[preKey] !== null && a[postKey] !== null);
    if (valid.length === 0) return null;
    const avg = valid.reduce((sum, a) => sum + ((a[postKey] as number) - (a[preKey] as number)), 0) / valid.length;
    return (avg >= 0 ? '+' : '') + avg.toFixed(1);
  };

  const lifts = [
    { label: 'Achievement', val: avgLift('pre_achievement', 'post_achievement') },
    { label: 'Connection',  val: avgLift('pre_connection',  'post_connection')  },
    { label: 'Enjoyment',   val: avgLift('pre_enjoyment',   'post_enjoyment')   },
  ];

  const days = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    return {
      dayNumber: i + 1,
      dateStr,
      activities: activities.filter(a => a.day_number === i + 1),
    };
  });

  const Footer = ({ n }: { n: number }) => (
    <View style={s.footer} fixed>
      <Text style={s.footerBrand}>Bloom</Text>
      <Text style={s.footerText}>Exported {exportedLabel}</Text>
      <Text style={s.footerPage}>Page {n}</Text>
    </View>
  );

  return (
    <Document title={`Bloom — My 10-Day ${spell.programme}`} author="Bloom">
      {/* Page 1: header + stats + Days 1–5 */}
      <Page size="A4" style={s.page}>
        <View style={s.coverHeader}>
          <View>
            <Text style={s.coverTitle}>Bloom</Text>
            <Text style={s.coverSubtitle}>My 10-Day {spell.programme}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.coverMetaLabel}>{startLabel} — {endLabel}</Text>
            <Text style={s.coverMetaValue}>{completedCount} of {totalPlanned} activities completed</Text>
          </View>
        </View>

        {completedCount > 0 && (
          <>
            <Text style={s.sectionHeading}>Average ACE lift across completed activities</Text>
            <View style={s.statsRow}>
              {lifts.map(({ label, val }) => (
                <View key={label} style={s.statBox}>
                  <Text style={[s.statValue, val && val.startsWith('+') ? s.statValuePos : {}]}>
                    {val ?? '—'}
                  </Text>
                  <Text style={s.statLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={s.sectionHeading}>Days 1 – 5</Text>
        {days.slice(0, 5).map(d => <DayBlock key={d.dayNumber} {...d} />)}
        <Footer n={1} />
      </Page>

      {/* Page 2: Days 6–10 */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionHeading}>Days 6 – 10</Text>
        {days.slice(5).map(d => <DayBlock key={d.dayNumber} {...d} />)}
        <Footer n={2} />
      </Page>

      {/* Page 3: Depression score tracking & clinical notes */}
      <Page size="A4" style={s.page}>
        {/* Page header */}
        <View style={s.coverHeader}>
          <View>
            <Text style={s.coverTitle}>Progress Notes</Text>
            <Text style={s.coverSubtitle}>Depression score tracking & recommendations for your provider</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.coverMetaLabel}>Exported</Text>
            <Text style={s.coverMetaValue}>{exportedLabel}</Text>
          </View>
        </View>

        {/* Before & after the programme — wellbeing check */}
        <Text style={[s.sectionHeading, { marginBottom: 8 }]}>How I felt — before &amp; after the program</Text>
        <View style={[s.twoCol, { marginBottom: 16 }]}>
          {(['Before the program', 'After the program'] as const).map(label => (
            <View key={label} style={s.wellbeingCard}>
              <View style={s.wellbeingHeader}>
                <Text style={s.wellbeingHeaderText}>{label}</Text>
              </View>
              <View style={s.wellbeingBody}>
                {/* Date */}
                <View style={s.wellbeingDateRow}>
                  <Text style={s.wellbeingDateLabel}>Date</Text>
                  <View style={s.wellbeingDateField} />
                </View>
                {/* 0–10 ratings */}
                {[
                  'Overall mood',
                  'Energy & motivation',
                  'Sense of pleasure',
                  'Connection to others',
                ].map(item => (
                  <View key={item} style={s.wellbeingRow}>
                    <Text style={s.wellbeingLabel}>{item}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={s.wellbeingField} />
                      <Text style={s.wellbeingSlash}>/10</Text>
                    </View>
                  </View>
                ))}
                {/* Open reflection */}
                <Text style={s.wellbeingPrompt}>
                  {label === 'Before the program' ? 'One thing I want from this' : 'One thing I noticed or that changed'}
                </Text>
                <View style={s.wellbeingTextLine} />
                <View style={s.wellbeingTextLine} />
              </View>
            </View>
          ))}
        </View>

        {/* PHQ-9 tracker */}
        <View style={s.phqBox}>
          <View style={s.phqBoxHeader}>
            <Text style={s.phqBoxHeaderText}>PHQ-9 Depression Score Tracker</Text>
            <Text style={s.phqBoxHeaderSub}>Patient Health Questionnaire — 9 items · Score 0–27 · Complete with your healthcare provider</Text>
          </View>
          <View style={s.phqBoxBody}>
            {/* Scale bands */}
            <Text style={[s.sectionHeading, { marginTop: 0 }]}>Severity scale</Text>
            <View style={s.scaleRow}>
              {[
                { label: 'Minimal',  sub: '0–4',  bg: '#5C8F6A' },
                { label: 'Mild',     sub: '5–9',  bg: '#7DAF6A' },
                { label: 'Moderate', sub: '10–14', bg: '#C8A84B' },
                { label: 'Mod-Sev', sub: '15–19', bg: '#C17C5A' },
                { label: 'Severe',  sub: '20–27', bg: '#9B3A45' },
              ].map(band => (
                <View key={band.label} style={[s.scaleBand, { backgroundColor: band.bg }]}>
                  <Text style={s.scaleBandText}>{band.label}</Text>
                  <Text style={s.scaleBandSub}>{band.sub}</Text>
                </View>
              ))}
            </View>

            {/* Score entry fields */}
            <View style={s.scoreFieldRow}>
              <View style={s.scoreField}>
                <Text style={s.scoreFieldLabel}>Score before programme</Text>
                <Text style={s.scoreFieldValue}>___</Text>
                <Text style={s.scoreFieldHint}>Date: ________________</Text>
              </View>
              <View style={s.scoreField}>
                <Text style={s.scoreFieldLabel}>Score after programme</Text>
                <Text style={s.scoreFieldValue}>___</Text>
                <Text style={s.scoreFieldHint}>Date: ________________</Text>
              </View>
              <View style={s.scoreField}>
                <Text style={s.scoreFieldLabel}>Change</Text>
                <Text style={s.scoreFieldValue}>___</Text>
                <Text style={s.scoreFieldHint}>Negative = improvement</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Insights from ACE data */}
        {completedCount > 0 && (() => {
          // Best ACE category by avg lift
          const catLifts: { label: string; avg: number }[] = [];
          const liftFor = (pre: keyof ScheduledActivity, post: keyof ScheduledActivity) => {
            const valid = completedActivities.filter(a => a[pre] !== null && a[post] !== null);
            if (!valid.length) return null;
            return valid.reduce((s, a) => s + ((a[post] as number) - (a[pre] as number)), 0) / valid.length;
          };
          const aLift = liftFor('pre_achievement', 'post_achievement');
          const cLift = liftFor('pre_connection',  'post_connection');
          const eLift = liftFor('pre_enjoyment',   'post_enjoyment');
          if (aLift !== null) catLifts.push({ label: 'Achievement', avg: aLift });
          if (cLift !== null) catLifts.push({ label: 'Connection',  avg: cLift });
          if (eLift !== null) catLifts.push({ label: 'Enjoyment',   avg: eLift });
          catLifts.sort((a, b) => b.avg - a.avg);
          const bestCat = catLifts[0] ?? null;

          // Top 3 activities by total lift
          const topActivities = [...completedActivities]
            .map(a => {
              const pairs = [
                [a.pre_achievement, a.post_achievement],
                [a.pre_connection,  a.post_connection],
                [a.pre_enjoyment,   a.post_enjoyment],
              ] as [number | null, number | null][];
              const totalLift = pairs.reduce((sum, [pre, post]) =>
                pre !== null && post !== null ? sum + (post - pre) : sum, 0);
              return { name: a.activity_name, lift: totalLift };
            })
            .sort((a, b) => b.lift - a.lift)
            .slice(0, 3);

          return (
            <View style={s.insightCard}>
              <View style={s.insightHeader}>
                <Text style={s.insightHeaderText}>What your ACE data shows</Text>
              </View>
              <View style={s.insightBody}>
                {bestCat && (
                  <Text style={[s.insightBodyText, { marginBottom: 8 }]}>
                    <Text style={s.insightBold}>{bestCat.label}</Text>
                    {' '}produced your highest average mood lift ({bestCat.avg >= 0 ? '+' : ''}{bestCat.avg.toFixed(1)} per activity).
                    {' '}Activities in this category may be especially beneficial to continue or increase.
                  </Text>
                )}
                {topActivities.length > 0 && (
                  <>
                    <Text style={[s.sectionHeading, { marginTop: 4, marginBottom: 6 }]}>Your highest-impact activities</Text>
                    {topActivities.map((a, i) => (
                      <View key={i} style={s.bulletRow}>
                        <Text style={s.bullet}>{i + 1}.</Text>
                        <Text style={s.bulletText}>
                          <Text style={s.insightBold}>{a.name}</Text>
                          {a.lift !== 0 ? `  (total ACE lift: ${a.lift >= 0 ? '+' : ''}${a.lift})` : ''}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            </View>
          );
        })()}

        {/* Recommendations */}
        <View style={s.insightCard}>
          <View style={s.insightHeader}>
            <Text style={s.insightHeaderText}>Recommendations for continued improvement</Text>
          </View>
          <View style={s.insightBody}>
            {[
              'Share this document with your therapist, GP, or mental health worker — the ACE lift data can help guide next steps.',
              'Consider repeating a PHQ-9 every 2–4 weeks to track progress over time.',
              'Activities that scored well on post-ACE ratings are strong candidates to build into a regular routine.',
              'If mood remains low despite activity, discuss medication or intensity of support with your provider.',
              'Behavioural activation works best when built on gradually — even 1–2 activities per week is a meaningful start.',
            ].map((tip, i) => (
              <View key={i} style={s.bulletRow}>
                <Text style={s.bullet}>·</Text>
                <Text style={s.bulletText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notes for healthcare provider */}
        <View style={s.notesArea}>
          <Text style={s.notesAreaLabel}>Notes for healthcare provider</Text>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={s.notesLine} />
          ))}
        </View>

        <Text style={[s.footerText, { fontSize: 7, color: C.muted, marginBottom: 4 }]}>
          The PHQ-9 is a validated screening tool (Kroenke et al., 2001). A score reduction of ≥5 points is generally considered clinically meaningful. This document does not replace professional clinical assessment.
        </Text>

        <Footer n={3} />
      </Page>
    </Document>
  );
}

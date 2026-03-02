import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ArrowRight, ArrowUp, ArrowDown, TrendingUp, Zap, Users, Heart, Smile, BrainCircuit } from 'lucide-react';
import { useSchedule } from '../../hooks/useSchedule';
import { activities as allActivities } from '../../data/activities';

function DirectionBadge({ value, label, inverted = false }: { value: number; label: string; inverted?: boolean }) {
  // inverted: true for depression (lower = better)
  const improved = inverted ? value < 0 : value > 0;
  const isNeutral = value === 0;

  return (
    <div className="flex items-center gap-1.5">
      {!isNeutral && improved && (
        inverted
          ? <ArrowDown size={14} className="text-[#5C7A55]" />
          : <ArrowUp size={14} className="text-[#5C7A55]" />
      )}
      {!isNeutral && !improved && (
        inverted
          ? <ArrowUp size={14} className="text-[#C17C5A]" />
          : <ArrowDown size={14} className="text-[#C17C5A]" />
      )}
      <span className={`text-2xl font-bold ${improved && !isNeutral ? 'text-[#3D5A4C]' : isNeutral ? 'text-[#9E9B97]' : 'text-[#9E9B97]'}`}>
        {value > 0 ? '+' : ''}{value.toFixed(1)}
      </span>
      <span className="text-xs text-[#9E9B97]">{label}</span>
    </div>
  );
}

export default function ProgressPage() {
  const navigate = useNavigate();
  const { activities, loading, schedule } = useSchedule();

  const completedActivities = activities.filter(
    a => a.completed &&
    a.post_achievement !== null &&
    a.post_connection !== null &&
    a.post_enjoyment !== null
  );

  const stats = useMemo(() => {
    if (completedActivities.length === 0) return null;

    const chartData = completedActivities.map(a => ({
      name: a.activity_name.length > 16 ? a.activity_name.slice(0, 14) + '...' : a.activity_name,
      fullName: a.activity_name,
      day: a.day_number,
      preA: a.pre_achievement ?? 0,
      postA: a.post_achievement ?? 0,
      preC: a.pre_connection ?? 0,
      postC: a.post_connection ?? 0,
      preE: a.pre_enjoyment ?? 0,
      postE: a.post_enjoyment ?? 0,
      preDep: a.pre_depression ?? null,
      postDep: a.post_depression ?? null,
    }));

    const avgLift = (key: 'A' | 'C' | 'E') => {
      const preKey = `pre${key}` as keyof typeof chartData[0];
      const postKey = `post${key}` as keyof typeof chartData[0];
      const lifts = chartData.map(d => (d[postKey] as number) - (d[preKey] as number));
      return lifts.reduce((a, b) => a + b, 0) / lifts.length;
    };

    const lifts = {
      A: avgLift('A'),
      C: avgLift('C'),
      E: avgLift('E'),
    };

    // Depression avg change
    const withDep = chartData.filter(d => d.preDep !== null && d.postDep !== null);
    const avgDepChange = withDep.length > 0
      ? withDep.reduce((sum, d) => sum + ((d.postDep as number) - (d.preDep as number)), 0) / withDep.length
      : null;

    const bestCategory = Object.entries(lifts).sort((a, b) => b[1] - a[1])[0];

    // Depression chart data
    const depChartData = withDep.map(d => ({
      name: d.name,
      before: d.preDep as number,
      after: d.postDep as number,
    }));

    return { chartData, lifts, bestCategory, avgDepChange, depChartData };
  }, [completedActivities]);

  // Insights
  const insights = useMemo(() => {
    if (completedActivities.length < 3) return null;

    const withDepression = completedActivities.filter(
      a => a.pre_depression !== null && a.post_depression !== null
    );

    let biggestDrop: { activity: typeof completedActivities[0]; drop: number } | null = null;

    for (const a of withDepression) {
      const drop = (a.pre_depression ?? 0) - (a.post_depression ?? 0);
      if (!biggestDrop || drop > biggestDrop.drop) {
        biggestDrop = { activity: a, drop };
      }
    }

    // Most effective catalogue activities (top 3 by avg lift)
    const byId = new Map<string, { total: number; count: number; name: string }>();
    for (const a of completedActivities) {
      if (!a.catalogue_id) continue;
      const lift =
        ((a.post_achievement ?? 0) - (a.pre_achievement ?? 0)) +
        ((a.post_connection ?? 0) - (a.pre_connection ?? 0)) +
        ((a.post_enjoyment ?? 0) - (a.pre_enjoyment ?? 0));
      const cat = allActivities.find(c => c.id === a.catalogue_id);
      const entry = byId.get(a.catalogue_id) ?? { total: 0, count: 0, name: cat?.name ?? a.activity_name };
      byId.set(a.catalogue_id, { total: entry.total + lift, count: entry.count + 1, name: entry.name });
    }
    const topActivities = [...byId.entries()]
      .map(([id, { total, count, name }]) => ({ id, avg: total / count, name }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);

    return { biggestDrop, topActivities };
  }, [completedActivities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#7D9B76] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!schedule || completedActivities.length < 3) {
    return (
      <div className="text-center py-24 max-w-md mx-auto">
        <div className="w-16 h-16 bg-[#F0F7EE] rounded-2xl flex items-center justify-center mx-auto mb-5">
          <TrendingUp size={28} className="text-[#7D9B76]" />
        </div>
        <h1 className="text-xl font-bold text-[#3D5A4C] mb-3">Progress unlocks soon</h1>
        <p className="text-[#9E9B97] mb-2">
          Complete {Math.max(0, 3 - completedActivities.length)} more{' '}
          {3 - completedActivities.length === 1 ? 'activity' : 'activities'} to see your progress charts.
        </p>
        <p className="text-sm text-[#C8C4BE] mb-8">
          You've completed {completedActivities.length} so far. Keep going!
        </p>
        <button
          onClick={() => navigate('/schedule')}
          className="flex items-center gap-2 mx-auto bg-[#7D9B76] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5C7A55] transition-colors"
        >
          Back to my schedule
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const categoryNames: Record<string, { label: string; icon: typeof Zap; colour: string; lightColour: string }> = {
    A: { label: 'Achievement', icon: Zap, colour: '#D4A030', lightColour: '#D4C4A8' },
    C: { label: 'Connection', icon: Users, colour: '#7D9B76', lightColour: '#B8D4B8' },
    E: { label: 'Enjoyment', icon: Heart, colour: '#C17C5A', lightColour: '#F5D4A0' },
  };

  const [bestKey, bestLift] = stats!.bestCategory;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#3D5A4C] mb-1">Your progress</h1>
        <p className="text-[#9E9B97]">
          Based on {completedActivities.length} completed {completedActivities.length === 1 ? 'activity' : 'activities'}
        </p>
      </div>

      {/* Best category callout */}
      {bestLift > 0 && (
        <div className="bg-[#F0F7EE] border border-[#C8DCC4] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ArrowUp size={20} className="text-[#5C7A55]" />
            <p className="font-semibold text-[#3D5A4C]">Your biggest mood lift</p>
          </div>
          <p className="text-[#5C7A55]">
            Activities boosted your <strong>{categoryNames[bestKey].label}</strong> score by an
            average of <strong>+{bestLift.toFixed(1)} points</strong>.
            {' '}These are activities worth prioritising.
          </p>
        </div>
      )}

      {/* Average lifts — ACE + Depression */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(stats!.lifts).map(([key, lift]) => {
          const { label, icon: Icon, colour } = categoryNames[key];
          return (
            <div key={key} className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm p-5 text-center">
              <Icon size={20} className="mx-auto mb-2" style={{ color: colour }} />
              <p className="text-sm text-[#9E9B97] mb-1">{label}</p>
              <DirectionBadge value={lift} label="avg lift" />
            </div>
          );
        })}
        {stats!.avgDepChange !== null && (
          <div className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm p-5 text-center">
            <BrainCircuit size={20} className="mx-auto mb-2 text-[#6A5A9C]" />
            <p className="text-sm text-[#9E9B97] mb-1">Depression</p>
            <DirectionBadge value={stats!.avgDepChange} label={stats!.avgDepChange < 0 ? 'improved' : 'avg change'} inverted />
          </div>
        )}
      </div>

      {/* Consolidated ACE chart: Before vs After for all three dimensions */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm p-6">
        <h2 className="font-semibold text-[#3D5A4C] mb-1">Expected vs actual: ACE scores</h2>
        <p className="text-xs text-[#9E9B97] mb-2">
          How your predictions compared to reality across all three dimensions.
          <span className="ml-1 text-[#5C7A55]">Higher = better.</span>
        </p>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          {Object.entries(categoryNames).map(([key, { label, colour, lightColour }]) => (
            <div key={key} className="flex items-center gap-2 text-xs text-[#8A8680]">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ background: lightColour }} />
                <span>Expected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ background: colour }} />
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats!.chartData} margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9E9B97' }} angle={-30} textAnchor="end" />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9E9B97' }} />
            <Tooltip
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  preA: 'Expected A', postA: 'Actual A',
                  preC: 'Expected C', postC: 'Actual C',
                  preE: 'Expected E', postE: 'Actual E',
                };
                return [value, labels[name] ?? name];
              }}
              contentStyle={{ borderRadius: 8, border: '1px solid #E8E4DE', fontSize: 12 }}
            />
            <Bar dataKey="preA" name="preA" fill="#D4C4A8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="postA" name="postA" fill="#D4A030" radius={[4, 4, 0, 0]} />
            <Bar dataKey="preC" name="preC" fill="#B8D4B8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="postC" name="postC" fill="#7D9B76" radius={[4, 4, 0, 0]} />
            <Bar dataKey="preE" name="preE" fill="#F5D4A0" radius={[4, 4, 0, 0]} />
            <Bar dataKey="postE" name="postE" fill="#C17C5A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Depression trend chart */}
      {stats!.depChartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm p-6">
          <h2 className="font-semibold text-[#3D5A4C] mb-1">Depression: before vs after each activity</h2>
          <p className="text-xs text-[#9E9B97] mb-5">
            <span className="text-[#5C7A55]">Lower = better.</span> When the bar drops, the activity helped.
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats!.depChartData} margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9E9B97' }} angle={-30} textAnchor="end" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9E9B97' }} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name === 'before' ? 'Before' : 'After']}
                contentStyle={{ borderRadius: 8, border: '1px solid #E8E4DE', fontSize: 12 }}
              />
              <Legend formatter={(v) => v === 'before' ? 'Before' : 'After'} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="before" name="before" fill="#C8B8E8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="after" name="after" fill="#6A5A9C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insights section */}
      {insights && (insights.biggestDrop || insights.topActivities.length > 0) && (
        <div className="space-y-4">
          <h2 className="font-semibold text-[#3D5A4C] text-lg">What's working</h2>

          {insights.biggestDrop && insights.biggestDrop.drop > 0 && (
            <div className="bg-[#F0F7EE] border border-[#C8DCC4] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-9 h-9 bg-[#D8EDD8] rounded-xl flex items-center justify-center shrink-0">
                <Smile size={18} className="text-[#3D5A4C]" />
              </div>
              <div>
                <p className="font-semibold text-[#3D5A4C] text-sm">Biggest mood improvement</p>
                <p className="text-sm text-[#5C7A55] mt-0.5">
                  After <strong>{insights.biggestDrop.activity.activity_name}</strong>, your depression went
                  from <strong>{insights.biggestDrop.activity.pre_depression}</strong> to{' '}
                  <strong>{insights.biggestDrop.activity.post_depression}</strong>.
                  {' '}<ArrowDown size={12} className="inline text-[#5C7A55]" /> This improved.
                </p>
              </div>
            </div>
          )}

          {insights.topActivities.length > 0 && (
            <div className="bg-white border border-[#E8E4DE] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#7D9B76]" />
                <p className="font-semibold text-[#3D5A4C] text-sm">Activities that work best for you</p>
              </div>
              <div className="space-y-3">
                {insights.topActivities.map(({ id, avg, name }, i) => (
                  <div key={id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F0F7EE] text-[#7D9B76] text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#3D5A4C] flex-1">{name}</span>
                    <div className="flex items-center gap-1">
                      <ArrowUp size={12} className="text-[#5C7A55]" />
                      <span className="text-xs font-semibold text-[#7D9B76] bg-[#F0F7EE] px-2 py-0.5 rounded-lg">
                        +{avg.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-[#9E9B97] text-center pb-4">
        Keep going. The more activities you log, the clearer the picture becomes.
      </p>
    </div>
  );
}

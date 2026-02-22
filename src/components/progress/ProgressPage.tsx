import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ArrowRight, TrendingUp, Zap, Users, Heart } from 'lucide-react';
import { useSchedule } from '../../hooks/useSchedule';

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
      name: a.activity_name.length > 16 ? a.activity_name.slice(0, 14) + '…' : a.activity_name,
      fullName: a.activity_name,
      day: a.day_number,
      preA: a.pre_achievement ?? 0,
      postA: a.post_achievement ?? 0,
      preC: a.pre_connection ?? 0,
      postC: a.post_connection ?? 0,
      preE: a.pre_enjoyment ?? 0,
      postE: a.post_enjoyment ?? 0,
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

    const bestCategory = Object.entries(lifts).sort((a, b) => b[1] - a[1])[0];

    return { chartData, lifts, bestCategory };
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
          You've completed {completedActivities.length} so far — keep going!
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

  const categoryNames: Record<string, { label: string; icon: typeof Zap; colour: string }> = {
    A: { label: 'Achievement', icon: Zap, colour: '#D4A030' },
    C: { label: 'Connection', icon: Users, colour: '#7D9B76' },
    E: { label: 'Enjoyment', icon: Heart, colour: '#C17C5A' },
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
            <TrendingUp size={20} className="text-[#7D9B76]" />
            <p className="font-semibold text-[#3D5A4C]">Your biggest mood lift</p>
          </div>
          <p className="text-[#5C7A55]">
            Activities boosted your <strong>{categoryNames[bestKey].label}</strong> score by an
            average of <strong>+{bestLift.toFixed(1)} points</strong>.
            {' '}These are activities worth prioritising.
          </p>
        </div>
      )}

      {/* Average lifts */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(stats!.lifts).map(([key, lift]) => {
          const { label, icon: Icon, colour } = categoryNames[key];
          return (
            <div key={key} className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm p-5 text-center">
              <Icon size={20} className="mx-auto mb-2" style={{ color: colour }} />
              <p className="text-sm text-[#9E9B97] mb-1">{label}</p>
              <p className={`text-2xl font-bold ${lift > 0 ? 'text-[#3D5A4C]' : 'text-[#9E9B97]'}`}>
                {lift > 0 ? '+' : ''}{lift.toFixed(1)}
              </p>
              <p className="text-xs text-[#9E9B97]">avg lift</p>
            </div>
          );
        })}
      </div>

      {/* Chart: Expected vs actual per activity */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm p-6">
        <h2 className="font-semibold text-[#3D5A4C] mb-1">Expected vs actual — Achievement</h2>
        <p className="text-xs text-[#9E9B97] mb-5">How your predictions compared to reality</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stats!.chartData} margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9E9B97' }} angle={-30} textAnchor="end" />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9E9B97' }} />
            <Tooltip
              formatter={(value, name) => [value, name === 'preA' ? 'Expected' : 'Actual']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E8E4DE', fontSize: 12 }}
            />
            <Legend formatter={(v) => v === 'preA' ? 'Expected' : 'Actual'} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="preA" name="preA" fill="#D4C4A8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="postA" name="postA" fill="#D4A030" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm p-6">
        <h2 className="font-semibold text-[#3D5A4C] mb-1">Expected vs actual — Connection</h2>
        <p className="text-xs text-[#9E9B97] mb-5">How connected you expected to feel vs how you actually felt</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stats!.chartData} margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9E9B97' }} angle={-30} textAnchor="end" />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9E9B97' }} />
            <Tooltip
              formatter={(value, name) => [value, name === 'preC' ? 'Expected' : 'Actual']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E8E4DE', fontSize: 12 }}
            />
            <Legend formatter={(v) => v === 'preC' ? 'Expected' : 'Actual'} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="preC" name="preC" fill="#B8D4B8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="postC" name="postC" fill="#7D9B76" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm p-6">
        <h2 className="font-semibold text-[#3D5A4C] mb-1">Expected vs actual — Enjoyment</h2>
        <p className="text-xs text-[#9E9B97] mb-5">Often we enjoy things more than we expect to</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stats!.chartData} margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9E9B97' }} angle={-30} textAnchor="end" />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9E9B97' }} />
            <Tooltip
              formatter={(value, name) => [value, name === 'preE' ? 'Expected' : 'Actual']}
              contentStyle={{ borderRadius: 8, border: '1px solid #E8E4DE', fontSize: 12 }}
            />
            <Legend formatter={(v) => v === 'preE' ? 'Expected' : 'Actual'} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="preE" name="preE" fill="#F5D4A0" radius={[4, 4, 0, 0]} />
            <Bar dataKey="postE" name="postE" fill="#C17C5A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-[#9E9B97] text-center pb-4">
        Keep going — the more activities you log, the clearer the picture becomes.
      </p>
    </div>
  );
}

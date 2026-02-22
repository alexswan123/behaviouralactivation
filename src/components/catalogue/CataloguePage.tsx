import { useState } from 'react';
import { Search, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useCatalogue } from '../../hooks/useCatalogue';
import { useSchedule } from '../../hooks/useSchedule';
import { usePastActivities } from '../../hooks/usePastActivities';
import CategoryFilter from './CategoryFilter';
import ActivityCard from './ActivityCard';
import AddActivityModal from '../schedule/AddActivityModal';
import type { CatalogueActivity, Category } from '../../lib/types';
import { categoryColours, categoryLabels } from '../../data/activities';
import { spell } from '../../lib/spelling';

export default function CataloguePage() {
  const { search, setSearch, activeCategory, setActiveCategory, groupedFiltered, filtered } = useCatalogue();
  const { addActivity, schedule } = useSchedule();
  const { items: pastItems, add: addPast, remove: removePast } = usePastActivities();
  const [selectedActivity, setSelectedActivity] = useState<CatalogueActivity | null>(null);
  const [pastInput, setPastInput] = useState('');
  const [pastExpanded, setPastExpanded] = useState(true);
  // When adding from past list, pre-fill the custom name
  const [pastToAdd, setPastToAdd] = useState<string | null>(null);

  const handleModalAdd = async (data: {
    dayNumber: number;
    activity_name: string;
    scheduled_time: string;
    catalogue_id: string | null;
    category: Category | null;
  }) => {
    await addActivity(data);
  };

  const handleAddPast = () => {
    if (!pastInput.trim()) return;
    addPast(pastInput);
    setPastInput('');
  };

  const groupOrder: Record<string, string[]> = {
    pleasure: ['Creative', 'Nature', 'Entertainment', 'Food & Pampering'],
    social: ['One-to-one', 'Group & Community'],
    achievement: ['Home & Admin', 'Learning & Work', 'Physical'],
    body: ['Sleep & Rest', 'Movement', 'Nourishment', 'Sensory'],
  };

  const categoryOrder = ['pleasure', 'social', 'achievement', 'body'];

  const orderedGroups: { key: string; category: string; group: string; items: typeof filtered }[] = [];
  for (const cat of categoryOrder) {
    if (activeCategory !== 'all' && activeCategory !== cat) continue;
    for (const grp of groupOrder[cat] ?? []) {
      const items = groupedFiltered[`${cat}:${grp}`];
      if (items?.length) orderedGroups.push({ key: `${cat}:${grp}`, category: cat, group: grp, items });
    }
  }

  const categorySections: { category: string; groups: typeof orderedGroups }[] = [];
  if (activeCategory === 'all') {
    for (const cat of categoryOrder) {
      const groups = orderedGroups.filter(g => g.category === cat);
      if (groups.length) categorySections.push({ category: cat, groups });
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2A3D32] mb-2">Activity catalogue</h1>
        <p className="text-[#8A8680] text-base">
          {filtered.length} activities — click any to add it to your schedule
        </p>
      </div>

      {/* ── Things I used to enjoy ───────────────────────────────────────── */}
      <div className="bg-white border-2 border-[#E8E3DB] rounded-2xl mb-8 overflow-hidden">
        <button
          onClick={() => setPastExpanded(e => !e)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#FAF6F0] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFF0DC] rounded-lg flex items-center justify-center">
              <span className="text-[#C17C5A] text-base">✦</span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#2A3D32] text-sm">Things I enjoy</p>
              <p className="text-xs text-[#8A8680]">
                {pastItems.length === 0
                  ? 'Activities you enjoy or want to do more of — quick to add to your schedule'
                  : `${pastItems.length} thing${pastItems.length === 1 ? '' : 's'} saved`}
              </p>
            </div>
          </div>
          {pastExpanded ? <ChevronUp size={16} className="text-[#ABA8A3]" /> : <ChevronDown size={16} className="text-[#ABA8A3]" />}
        </button>

        {pastExpanded && (
          <div className="px-6 pb-5 border-t border-[#EDE8E0]">
            <p className="text-sm text-[#8A8680] mt-4 mb-4 leading-relaxed">
              Keep a personal list of activities that bring you joy — small or big.
              Tap any item to add it to your schedule.
            </p>

            {/* Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. evening walks, cooking, calling a friend…"
                value={pastInput}
                onChange={e => setPastInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddPast()}
                className="flex-1 px-4 py-2.5 border-2 border-[#EDE8E0] rounded-xl text-sm bg-[#FAF6F0] focus:outline-none focus:border-[#7D9B76] placeholder:text-[#C4BFB8] text-[#3D5A4C]"
              />
              <button
                onClick={handleAddPast}
                disabled={!pastInput.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3D5A4C] text-white text-sm font-semibold hover:bg-[#2A3D32] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={15} />
                Add
              </button>
            </div>

            {/* List */}
            {pastItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pastItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 bg-[#F0F7EE] border border-[#C8DCC4] rounded-xl pl-4 pr-2 py-2"
                  >
                    <span className="text-sm text-[#3D5A4C] font-medium">{item.text}</span>
                    <button
                      onClick={() => { setPastToAdd(item.text); }}
                      className="text-xs text-[#7D9B76] font-semibold hover:text-[#3D5A4C] transition-colors px-1"
                      title="Add to schedule"
                    >
                      + schedule
                    </button>
                    <button
                      onClick={() => removePast(item.id)}
                      className="p-0.5 rounded-md hover:bg-[#D8EDD8] text-[#9E9B97] hover:text-[#3D5A4C] transition-colors"
                      aria-label="Remove"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ABA8A3]" />
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-[#E8E3DB] rounded-xl bg-white text-[#3D5A4C] placeholder:text-[#C4BFB8] focus:outline-none focus:border-[#7D9B76] text-sm"
          />
        </div>
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Content */}
      {orderedGroups.length === 0 ? (
        <p className="text-center text-[#ABA8A3] py-16 text-base">No activities match your search</p>
      ) : activeCategory === 'all' ? (
        <div className="space-y-12">
          {categorySections.map(({ category, groups }) => {
            const colours = categoryColours[category];
            return (
              <div key={category}>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6"
                  style={{ background: colours.bg, color: colours.text, border: `1.5px solid ${colours.border}` }}
                >
                  <span className="font-bold text-sm tracking-wide">{categoryLabels[category]}</span>
                </div>
                <div className="space-y-8">
                  {groups.map(({ key, group, items }) => (
                    <div key={key}>
                      <h3 className="text-sm font-semibold text-[#8A8680] uppercase tracking-widest mb-4">{group}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(activity => (
                          <ActivityCard key={activity.id} activity={activity} onAdd={setSelectedActivity} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-10">
          {orderedGroups.map(({ key, group, items }) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-[#8A8680] uppercase tracking-widest mb-4">{group}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} onAdd={setSelectedActivity} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {(selectedActivity || pastToAdd !== null) && (
        <AddActivityModal
          initialCustomName={pastToAdd ?? undefined}
          onAdd={async (data) => {
            await handleModalAdd(data);
            setSelectedActivity(null);
            setPastToAdd(null);
          }}
          onClose={() => { setSelectedActivity(null); setPastToAdd(null); }}
          maxDay={10}
        />
      )}

      {!schedule && (selectedActivity || pastToAdd !== null) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3D5A4C] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium">
          Start a {spell.programme.toLowerCase()} first to add activities to your schedule
        </div>
      )}
    </div>
  );
}

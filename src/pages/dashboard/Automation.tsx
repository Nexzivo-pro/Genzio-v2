import { useState } from 'react';
import { Plus, Zap, ArrowLeft, Save, Clock, Settings2, Mail, Trash2, Check } from 'lucide-react';
import { EmptyState } from '../../components/dashboard/StatCard';

interface FollowupStep {
  id: string;
  delay: number;
  delayUnit: string;
  subject: string;
  body: string;
}

export default function Automation() {
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // Settings State
  const [stopOnReply, setStopOnReply] = useState(true);
  const [randomizeDelay, setRandomizeDelay] = useState(false);
  const [baseDelay, setBaseDelay] = useState(24);

  // Working Hours
  const [timezone, setTimezone] = useState('America/New_York');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [workingDays, setWorkingDays] = useState({
    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false
  });

  // Followup Steps
  const [followups, setFollowups] = useState<FollowupStep[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsConfiguring(false);
    }, 800);
  };

  const addFollowup = () => {
    setFollowups([
      ...followups,
      {
        id: Math.random().toString(36).substr(2, 9),
        delay: 2,
        delayUnit: 'days',
        subject: '',
        body: ''
      }
    ]);
  };

  const removeFollowup = (id: string) => {
    setFollowups(followups.filter(f => f.id !== id));
  };

  const updateFollowup = (id: string, field: keyof FollowupStep, value: any) => {
    setFollowups(followups.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const toggleDay = (day: string) => {
    setWorkingDays(prev => ({ ...prev, [day as keyof typeof prev]: !prev[day as keyof typeof prev] }));
  };

  if (isConfiguring) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsConfiguring(false)}
              className="p-2 rounded-lg bg-black/40 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-display font-medium text-white tracking-tight">
                Sequence Automation
              </h1>
              <p className="text-gray-400">Configure delivery rules and follow-up steps.</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content: Followups */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-neon-cyan" />
                Follow-up Sequence
              </h2>
            </div>

            {followups.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-gray-400 mb-4">No follow-up steps defined yet.</p>
                <button onClick={addFollowup} className="btn-secondary inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add First Follow-up
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {followups.map((step, index) => (
                  <div key={step.id} className="glass-card p-6 relative group">
                    <button 
                      onClick={() => removeFollowup(step.id)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <h3 className="text-sm font-medium text-white mb-4">Step {index + 1}</h3>
                    
                    <div className="space-y-4">
                      {/* Delay config */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Wait</span>
                        <input
                          type="number"
                          value={step.delay}
                          onChange={(e) => updateFollowup(step.id, 'delay', Number(e.target.value))}
                          className="w-20 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-neon-cyan/50"
                        />
                        <select
                          value={step.delayUnit}
                          onChange={(e) => updateFollowup(step.id, 'delayUnit', e.target.value)}
                          className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-neon-cyan/50"
                        >
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                        </select>
                        <span className="text-sm text-gray-400">before sending</span>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Follow-up Email Subject"
                          value={step.subject}
                          onChange={(e) => updateFollowup(step.id, 'subject', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-cyan/50"
                        />
                        <textarea
                          placeholder="Follow-up Email Body..."
                          value={step.body}
                          onChange={(e) => updateFollowup(step.id, 'body', e.target.value)}
                          className="w-full min-h-[120px] bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button onClick={addFollowup} className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Another Step
                </button>
              </div>
            )}
          </div>

          {/* Sidebar: Settings */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-neon-cyan" />
                Delivery Rules
              </h2>
              
              <div className="space-y-5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-start">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={stopOnReply}
                      onChange={(e) => setStopOnReply(e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${stopOnReply ? 'bg-neon-cyan border-neon-cyan' : 'border-white/20 bg-black/40 group-hover:border-white/40'}`}>
                      {stopOnReply && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Stop on Reply</div>
                    <div className="text-xs text-gray-400 mt-0.5">Automatically stop sequence when a prospect replies</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-start">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={randomizeDelay}
                      onChange={(e) => setRandomizeDelay(e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${randomizeDelay ? 'bg-neon-cyan border-neon-cyan' : 'border-white/20 bg-black/40 group-hover:border-white/40'}`}>
                      {randomizeDelay && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Randomize Delays</div>
                    <div className="text-xs text-gray-400 mt-0.5">Add ±20% jitter to sending times to mimic human behavior</div>
                  </div>
                </label>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Internal Delay (minutes)</label>
                  <input
                    type="number"
                    value={baseDelay}
                    onChange={(e) => setBaseDelay(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan/50"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Minimum delay between sending batch emails</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-neon-cyan" />
                Sending Schedule
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan/50"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan/50 [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan/50 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Active Days</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(workingDays).map(([day, isActive]) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                          isActive 
                            ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' 
                            : 'bg-black/40 text-gray-500 border border-white/5 hover:border-white/20'
                        }`}
                      >
                        {day[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-white mb-2 tracking-tight">Automation Rules</h1>
          <p className="text-gray-400">Set up triggers to auto-reply or update prospect status.</p>
        </div>
        <button onClick={() => setIsConfiguring(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>New Rule</span>
        </button>
      </div>

      <div className="glass-card">
        <EmptyState 
          title="No automations configured" 
          description="Build workflows to handle out-of-office replies, auto-tag leads based on intent, or move prospects across campaigns."
          action={
            <button onClick={() => setIsConfiguring(true)} className="btn-primary flex items-center gap-2 mt-2">
              <Zap className="w-5 h-5" />
              <span>Explore Templates</span>
            </button>
          }
        />
      </div>
    </div>
  );
}

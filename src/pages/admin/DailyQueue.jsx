import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminSidebar, AdminBottomNav, MobileTopBar } from '../../components/layout/Layout';
import { Avatar, EmptyState } from '../../components/ui/Primitives';
import { Check, X, Clock, Users, UserCheck, Wifi, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

const MOCK_QUEUE = [
  { id: '1', status: 'completed', time: '09:00', patientRef: 'PT-001', isWalkIn: false, doctor: 'Dr. Adaeze Okafor',  specialty: 'Family Medicine' },
  { id: '2', status: 'booked',    time: '09:15', patientRef: 'PT-002', isWalkIn: false, doctor: 'Dr. Adaeze Okafor',  specialty: 'Family Medicine' },
  { id: '3', status: 'booked',    time: '09:30', patientRef: 'WALK-01', isWalkIn: true,  doctor: 'Dr. Adaeze Okafor',  specialty: 'Family Medicine' },
  { id: '4', status: 'no-show',   time: '10:00', patientRef: 'PT-003', isWalkIn: false, doctor: 'Dr. Tolu Adebayo',   specialty: "Women's Health" },
  { id: '5', status: 'booked',    time: '10:30', patientRef: 'PT-004', isWalkIn: false, doctor: 'Dr. Tolu Adebayo',   specialty: "Women's Health" },
  { id: '6', status: 'booked',    time: '11:00', patientRef: 'PT-005', isWalkIn: false, doctor: 'Dr. Chinedu Eze',    specialty: 'General Practice' },
  { id: '7', status: 'booked',    time: '11:30', patientRef: 'WALK-02', isWalkIn: true,  doctor: 'Dr. Chinedu Eze',    specialty: 'General Practice' },
  { id: '8', status: 'booked',    time: '14:00', patientRef: 'PT-006', isWalkIn: false, doctor: 'Dr. Adaeze Okafor',  specialty: 'Family Medicine' },
];

const STATUS_CONFIG = {
  booked:    { label: 'Upcoming',  class: 'badge-blue',  row: 'bg-white' },
  completed: { label: 'Seen',      class: 'badge-green', row: 'bg-emerald-50/50' },
  'no-show': { label: 'No-show',   class: 'badge-red',   row: 'bg-red-50/50' },
  cancelled: { label: 'Cancelled', class: 'badge-slate', row: 'bg-slate-50' },
};

export default function DailyQueue() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [filter, setFilter] = useState('all');
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  const filtered = filter === 'all' ? queue : queue.filter(a => a.status === filter);
  const counts = {
    booked:    queue.filter(a => a.status === 'booked').length,
    completed: queue.filter(a => a.status === 'completed').length,
    'no-show': queue.filter(a => a.status === 'no-show').length,
  };

  const updateStatus = (id, newStatus) => {
    setQueue(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    supabase.from('appointments').update({ status: newStatus }).eq('id', id).then(() => {});
  };

  const TABS = [
    { key: 'all',       label: `All (${queue.length})` },
    { key: 'booked',    label: `Upcoming (${counts.booked})` },
    { key: 'completed', label: `Seen (${counts.completed})` },
    { key: 'no-show',   label: `No-show (${counts['no-show']})` },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title="Daily Queue" onBack={() => navigate('/admin/dashboard')} />

        {/* Desktop header */}
        <div className="hidden lg:block border-b border-slate-200 bg-white px-8 py-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-display text-2xl font-bold text-slate-900">Daily Queue</h1>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <Wifi size={13} className="animate-pulse" />
              Live
            </div>
          </div>
          <p className="text-sm text-slate-500">{today}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-white px-4 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={clsx(
                  'shrink-0 py-3 px-4 text-sm font-medium border-b-2 transition',
                  filter === tab.key
                    ? 'border-teal-700 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          {filtered.length === 0 ? (
            <EmptyState icon={Users} title="No appointments here"
              description="There are no appointments matching this filter." />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(apt => {
                      const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.booked;
                      return (
                        <tr key={apt.id} className={clsx('transition', cfg.row)}>
                          <td className="px-5 py-3 font-mono font-semibold text-slate-800">{apt.time}</td>
                          <td className="px-5 py-3 font-medium text-slate-900">{apt.patientRef}</td>
                          <td className="px-5 py-3">
                            <p className="text-slate-800">{apt.doctor}</p>
                            <p className="text-xs text-slate-400">{apt.specialty}</p>
                          </td>
                          <td className="px-5 py-3">
                            {apt.isWalkIn
                              ? <span className="badge badge-orange">Walk-in</span>
                              : <span className="badge badge-slate">Booked</span>}
                          </td>
                          <td className="px-5 py-3">
                            <span className={clsx('badge', cfg.class)}>{cfg.label}</span>
                          </td>
                          <td className="px-5 py-3">
                            {apt.status === 'booked' && (
                              <div className="flex gap-2">
                                <button onClick={() => updateStatus(apt.id, 'completed')}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition">
                                  <Check size={13} /> Seen
                                </button>
                                <button onClick={() => updateStatus(apt.id, 'no-show')}
                                  className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                                  <X size={13} /> No-show
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden space-y-3">
                {filtered.map(apt => {
                  const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.booked;
                  return (
                    <div key={apt.id} className={clsx('card p-4', cfg.row)}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="font-mono text-lg font-bold text-slate-800">{apt.time}</span>
                          <p className="text-sm font-medium text-slate-700 mt-0.5">{apt.patientRef}</p>
                          <p className="text-xs text-slate-400">{apt.doctor}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          {apt.isWalkIn && <span className="badge badge-orange">Walk-in</span>}
                          <span className={clsx('badge', cfg.class)}>{cfg.label}</span>
                        </div>
                      </div>
                      {apt.status === 'booked' && (
                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                          <button onClick={() => updateStatus(apt.id, 'completed')}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition">
                            <Check size={15} /> Mark Seen
                          </button>
                          <button onClick={() => updateStatus(apt.id, 'no-show')}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
                            <X size={15} /> No-show
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}

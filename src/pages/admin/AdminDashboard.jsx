import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminSidebar, AdminBottomNav, MobileTopBar, PageHeader } from '../../components/layout/Layout';
import { StatCard, EmptyState, SkeletonCard } from '../../components/ui/Primitives';
import { ListOrdered, Users, CheckCircle2, XCircle, Calendar, TrendingUp, Settings, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const MOCK_STATS = {
  booked: 14,
  completed: 8,
  noShows: 2,
  walkIns: 3,
};

const MOCK_TODAY = [
  { id: '1', status: 'completed', time: '09:00', patientRef: 'PT-001', isWalkIn: false, doctor: 'Dr. Adaeze Okafor' },
  { id: '2', status: 'booked',    time: '09:15', patientRef: 'PT-002', isWalkIn: false, doctor: 'Dr. Adaeze Okafor' },
  { id: '3', status: 'booked',    time: '09:30', patientRef: 'WALK-01', isWalkIn: true,  doctor: 'Dr. Adaeze Okafor' },
  { id: '4', status: 'no-show',   time: '10:00', patientRef: 'PT-003', isWalkIn: false, doctor: 'Dr. Tolu Adebayo' },
  { id: '5', status: 'booked',    time: '10:30', patientRef: 'PT-004', isWalkIn: false, doctor: 'Dr. Tolu Adebayo' },
];

export default function AdminDashboard() {
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title="Admin Overview" />

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 max-w-5xl w-full mx-auto">
          <div className="hidden lg:flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Clinic Overview</h1>
              <p className="text-slate-500 text-sm mt-1">{today}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/queue" className="btn-primary gap-2">
                <ListOrdered size={16} /> View Daily Queue
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Calendar}     label="Booked Today"    value={MOCK_STATS.booked}     color="teal"   trend="+3 vs yesterday" />
            <StatCard icon={CheckCircle2} label="Seen so far"     value={MOCK_STATS.completed}  color="blue"   />
            <StatCard icon={XCircle}      label="No-shows"        value={MOCK_STATS.noShows}    color="red"    />
            <StatCard icon={Users}        label="Walk-ins"        value={MOCK_STATS.walkIns}    color="orange" />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link to="/admin/queue" className="card-hover p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                  <ListOrdered size={22} className="text-teal-700" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">Daily Queue</h3>
                  <p className="text-xs text-slate-500">{MOCK_STATS.booked - MOCK_STATS.completed} patients remaining today</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link to="/admin/doctors" className="card-hover p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Users size={22} className="text-blue-700" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">Manage Doctors</h3>
                  <p className="text-xs text-slate-500">Add doctors & set availability rules</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link to="/admin/settings" className="card-hover p-5 flex items-center justify-between sm:col-span-2">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <Settings size={22} className="text-slate-600" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">Clinic Settings</h3>
                  <p className="text-xs text-slate-500">Working hours, slot duration, SMS reminders, walk-in buffer allocations</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </div>

          {/* Today's quick view */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-slate-900">Today's Schedule (preview)</h2>
              <Link to="/admin/queue" className="text-xs text-teal-600 font-medium hover:underline">See full queue →</Link>
            </div>
            <div className="card overflow-hidden">
              <div className="divide-y divide-slate-100">
                {MOCK_TODAY.map(apt => (
                  <div key={apt.id} className="flex items-center gap-4 px-5 py-3">
                    <span className="font-mono text-sm font-semibold text-slate-700 w-12 shrink-0">{apt.time}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{apt.patientRef}</p>
                      <p className="text-xs text-slate-400">{apt.doctor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {apt.isWalkIn && <span className="badge badge-orange">Walk-in</span>}
                      <span className={`badge ${apt.status === 'completed' ? 'badge-green' : apt.status === 'no-show' ? 'badge-red' : 'badge-blue'}`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}

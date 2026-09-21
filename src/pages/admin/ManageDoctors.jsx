import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar, AdminBottomNav, MobileTopBar } from '../../components/layout/Layout';
import { Avatar, EmptyState } from '../../components/ui/Primitives';
import { Plus, Search, Edit2, Trash2, Users, Clock } from 'lucide-react';
import clsx from 'clsx';

const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Adaeze Okafor', specialty: 'Family Medicine',  slotDuration: 15, workDays: 'Mon–Fri', hours: '9:00 AM – 5:00 PM', status: 'active', avatarColor: 'teal' },
  { id: '2', name: 'Dr. Tolu Adebayo',  specialty: "Women's Health",   slotDuration: 30, workDays: 'Mon–Thu', hours: '8:00 AM – 2:00 PM', status: 'active', avatarColor: 'violet' },
  { id: '3', name: 'Dr. Chinedu Eze',   specialty: 'General Practice', slotDuration: 15, workDays: 'Mon–Sat', hours: '10:00 AM – 6:00 PM', status: 'inactive', avatarColor: 'blue' },
];

export default function ManageDoctors() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState(MOCK_DOCTORS);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title="Doctors" onBack={() => navigate('/admin/dashboard')} />

        <div className="hidden lg:flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Doctors</h1>
            <p className="text-slate-500 text-sm mt-1">{doctors.length} registered doctors in this clinic</p>
          </div>
          <button className="btn-primary">
            <Plus size={16} /> Add Doctor
          </button>
        </div>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 max-w-4xl">
          <div className="flex gap-3 mb-6 lg:hidden">
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" className="input pl-9 text-sm" placeholder="Search doctors…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn-primary"><Plus size={16} /></button>
          </div>

          <div className="hidden lg:flex gap-3 mb-6">
            <div className="relative max-w-xs">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" className="input pl-9 text-sm" placeholder="Search doctors…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Users} title="No doctors found" description="Add your first doctor to get started." action={<button className="btn-primary"><Plus size={15} /> Add Doctor</button>} />
          ) : (
            <div className="space-y-3">
              {filtered.map(doc => (
                <div key={doc.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Avatar name={doc.name} size="lg" color={doc.avatarColor} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                      <span className={clsx('badge', doc.status === 'active' ? 'badge-green' : 'badge-slate')}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-sm text-teal-600 font-medium mt-0.5">{doc.specialty}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={11} />{doc.slotDuration} min slots</span>
                      <span>{doc.workDays}</span>
                      <span>{doc.hours}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition">
                      <Edit2 size={15} />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}


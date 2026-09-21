import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { PatientSidebar, PatientBottomNav, MobileTopBar, PageHeader } from '../../components/layout/Layout';
import { StatCard, StatusBadge, Avatar, EmptyState, SkeletonCard } from '../../components/ui/Primitives';
import { HOSPITALS } from '../../lib/mockData';
import {
  Calendar, Clock, MapPin, Search, ChevronRight,
  TrendingUp, CheckCircle2, XCircle, AlertCircle, Building2, ShieldCheck
} from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';

// ── Mock appointments data ────────────────────────────────────────────────────
const MOCK_APPOINTMENTS = [
  {
    id: '1', status: 'booked',
    appointment_slots: {
      date: format(new Date(), 'yyyy-MM-dd'),
      start_time: '10:30:00',
      doctors: { name: 'Dr. Adaeze Okafor', specialties: { name: 'Family Medicine' }, hospitals: { name: 'Lagos Family Health', address: 'Ikeja, Lagos' } }
    }
  },
  {
    id: '2', status: 'booked',
    appointment_slots: {
      date: format(new Date(Date.now() + 86400000 * 2), 'yyyy-MM-dd'),
      start_time: '14:00:00',
      doctors: { name: 'Dr. Tolu Adebayo', specialties: { name: "Women's Health" }, hospitals: { name: 'VI Wellness Clinic', address: 'Victoria Island, Lagos' } }
    }
  },
  {
    id: '3', status: 'completed',
    appointment_slots: {
      date: format(new Date(Date.now() - 86400000 * 3), 'yyyy-MM-dd'),
      start_time: '09:00:00',
      doctors: { name: 'Dr. Chinedu Eze', specialties: { name: 'General Practice' }, hospitals: { name: 'Abuja Care Clinic', address: 'Wuse 2, Abuja' } }
    }
  },
];

function getDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEE, MMM d');
}

function AppointmentCard({ apt }) {
  const slot = apt.appointment_slots;
  const doctor = slot?.doctors;
  const dateLabel = getDateLabel(slot?.date);
  const colorMap = { 'Family Medicine': 'teal', "Women's Health": 'violet', 'General Practice': 'blue', default: 'teal' };
  const avatarColor = colorMap[doctor?.specialties?.name] || 'teal';

  return (
    <div className="card-hover p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <Avatar name={doctor?.name || ''} size="lg" color={avatarColor} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-slate-900 truncate">{doctor?.name}</h3>
          <StatusBadge status={apt.status} />
        </div>
        <p className="text-sm text-teal-600 font-medium mt-0.5">{doctor?.specialties?.name}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {dateLabel}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {slot?.start_time?.substring(0, 5)}
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPin size={12} />
            <span className="truncate">{doctor?.hospitals?.name}</span>
          </span>
        </div>
      </div>
      {apt.status === 'booked' && (
        <div className="flex sm:flex-col gap-2 sm:items-end shrink-0">
          {/* V2 hook */}
          <div className="rounded-xl bg-orange-50 border border-orange-100 px-3 py-2 text-center">
            <p className="text-xs text-orange-600 font-medium">Queue est.</p>
            <p className="text-sm font-bold text-orange-800">~15 min</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('appointments')
      .select(`id, status, appointment_slots ( date, start_time, doctors ( name, specialties(name), hospitals(name,address) ) )`)
      .eq('patient_id', user?.id || 'mock')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) setAppointments(MOCK_APPOINTMENTS);
    else setAppointments(data);
    setLoading(false);
  };

  const upcoming = appointments.filter(a => a.status === 'booked');
  const past = appointments.filter(a => a.status !== 'booked');

  return (
    <div className="flex min-h-screen bg-slate-50">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title="My Dashboard" />

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 max-w-5xl w-full mx-auto">
          {/* Welcome */}
          <div className="mb-8 hidden lg:block">
            <h1 className="font-display text-2xl font-bold text-slate-900">Good morning 👋</h1>
            <p className="text-slate-500 text-sm mt-1">Here's your appointment overview for today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Calendar} label="Upcoming" value={upcoming.length} color="teal" />
            <StatCard icon={CheckCircle2} label="Completed" value={past.filter(a => a.status === 'completed').length} color="blue" />
            <StatCard icon={XCircle} label="No-shows" value={past.filter(a => a.status === 'no-show').length} color="red" />
            <StatCard icon={TrendingUp} label="Total Visits" value={appointments.length} color="slate" />
          </div>

          {/* Discovery CTAs */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/hospitals"
              className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-teal-700 to-teal-600 p-5 text-white hover:shadow-lg transition-shadow">
              <div>
                <h2 className="font-display text-base font-bold">Browse Hospitals</h2>
                <p className="text-teal-100 text-xs mt-0.5">{HOSPITALS.length} clinics on the platform</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                <Building2 size={22} />
              </div>
            </Link>

            <Link to="/patient/search"
              className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 p-5 text-white hover:shadow-lg transition-shadow">
              <div>
                <h2 className="font-display text-base font-bold">Find a Doctor</h2>
                <p className="text-slate-300 text-xs mt-0.5">Search by name or specialty</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                <Search size={22} />
              </div>
            </Link>
          </div>

          {/* Featured hospitals strip */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-slate-900">Featured Hospitals</h2>
              <Link to="/hospitals" className="text-xs font-medium text-teal-700 hover:underline">View all →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {HOSPITALS.slice(0, 4).map(h => (
                <Link key={h.id} to={`/hospitals/${h.id}`}
                  className="shrink-0 card-hover w-52 overflow-hidden">
                  <div className={`bg-gradient-to-br ${h.gradient} flex h-20 items-center justify-center`}>
                    <span className="font-display text-2xl font-extrabold text-white/90">{h.initials}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-slate-900 truncate leading-snug">{h.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{h.lga}, {h.state}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <span className={`h-1.5 w-1.5 rounded-full ${h.openNow ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                      <span className={h.openNow ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                        {h.openNow ? 'Open' : 'Closed'}
                      </span>
                      <span className="ml-auto text-slate-400">{h.doctors} doctors</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Upcoming appointments */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-slate-900">Upcoming Appointments</h2>
              <span className="badge badge-blue">{upcoming.length}</span>
            </div>
            {loading ? (
              <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
            ) : upcoming.length === 0 ? (
              <EmptyState icon={Calendar} title="No upcoming appointments"
                description="Book a slot with any doctor in our network."
                action={<Link to="/patient/search" className="btn-primary">Book now</Link>} />
            ) : (
              <div className="space-y-4">{upcoming.map(a => <AppointmentCard key={a.id} apt={a} />)}</div>
            )}
          </section>

          {/* Past appointments */}
          {past.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-slate-900">Past Appointments</h2>
                <span className="badge badge-slate">{past.length}</span>
              </div>
              <div className="space-y-4">{past.map(a => <AppointmentCard key={a.id} apt={a} />)}</div>
            </section>
          )}
        </main>
      </div>

      <PatientBottomNav />
    </div>
  );
}

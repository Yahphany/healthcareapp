import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PatientSidebar, PatientBottomNav, MobileTopBar } from '../../components/layout/Layout';
import { Avatar } from '../../components/ui/Primitives';
import { HOSPITALS, DOCTORS_BY_HOSPITAL } from '../../lib/mockData';
import {
  MapPin, Star, Phone, Mail, Clock, ShieldCheck,
  ChevronRight, ArrowLeft, Users, Stethoscope, Calendar
} from 'lucide-react';
import clsx from 'clsx';

function DoctorRow({ doctor, hospitalId }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/patient/book/${doctor.id}`, { state: { hospitalId } })}
      className="card-hover flex items-center gap-4 p-4">
      <Avatar name={doctor.name} size="lg" color={doctor.avatarColor} />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 truncate">{doctor.name}</h3>
        <p className="text-sm text-teal-700 font-medium">{doctor.specialty}</p>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Clock size={11} />{doctor.slotDuration} min slots</span>
          <span className="flex items-center gap-1">
            <Star size={11} fill="#f59e0b" className="text-amber-400" />
            {doctor.rating} ({doctor.reviews})
          </span>
          <span className="font-semibold text-slate-700">{doctor.fee}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">{doctor.availability}</span>
        </div>
        <button className="btn-primary py-1.5 px-3 text-xs">Book</button>
      </div>
    </div>
  );
}

export default function HospitalDetail() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('doctors');

  const hospital = HOSPITALS.find(h => h.id === hospitalId);
  const doctors  = DOCTORS_BY_HOSPITAL[hospitalId] || [];

  if (!hospital) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Hospital not found.</p>
          <button onClick={() => navigate('/hospitals')} className="btn-primary">← Back to Hospitals</button>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: 'doctors', label: 'Doctors', count: doctors.length },
    { key: 'about',   label: 'About' },
    { key: 'hours',   label: 'Hours & Contact' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title={hospital.name} onBack={() => navigate('/hospitals')} />

        {/* Hero banner */}
        <div className={`bg-gradient-to-br ${hospital.gradient} relative overflow-hidden`}>
          {/* Back button on desktop */}
          <button onClick={() => navigate('/hospitals')}
            className="hidden lg:flex absolute top-5 left-6 items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition">
            <ArrowLeft size={16} /> All Hospitals
          </button>

          <div className="px-6 lg:px-8 pt-10 lg:pt-14 pb-8 lg:pb-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <span className="font-display text-3xl font-extrabold text-white">{hospital.initials}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-white">{hospital.name}</h1>
                {hospital.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-sm mb-3">
                <MapPin size={14} />
                <span>{hospital.address}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-white/90 text-sm">
                <span className="flex items-center gap-1.5">
                  <Star size={14} fill="white" /> {hospital.rating} ({hospital.reviews} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} /> {hospital.doctors} doctors
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={clsx('h-2.5 w-2.5 rounded-full', hospital.openNow ? 'bg-emerald-300' : 'bg-white/40')} />
                  {hospital.openNow ? 'Open now' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="sticky top-0 lg:top-0 z-10 border-b border-slate-200 bg-white">
          <div className="flex max-w-4xl mx-auto px-4 lg:px-8">
            {TABS.map(t => (
              <button key={t.key}
                onClick={() => setTab(t.key)}
                className={clsx(
                  'flex items-center gap-1.5 py-3.5 px-4 text-sm font-medium border-b-2 transition',
                  tab === t.key
                    ? 'border-teal-700 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}>
                {t.label}
                {t.count !== undefined && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-600">
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8 pb-28 lg:pb-8">
          <div className="max-w-4xl mx-auto">

            {/* ── Doctors Tab ────────────────────────────────────────────── */}
            {tab === 'doctors' && (
              <div className="space-y-3">
                {doctors.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No doctors listed yet.</div>
                ) : (
                  doctors.map(doc => (
                    <DoctorRow key={doc.id} doctor={doc} hospitalId={hospital.id} />
                  ))
                )}
              </div>
            )}

            {/* ── About Tab ──────────────────────────────────────────────── */}
            {tab === 'about' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="font-display font-semibold text-slate-900 mb-3">About this facility</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{hospital.about}</p>
                </div>

                <div className="card p-6">
                  <h2 className="font-display font-semibold text-slate-900 mb-4">Specialties offered</h2>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map(s => (
                      <div key={s}
                        className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-2.5">
                        <Stethoscope size={14} className="text-teal-600" />
                        <span className="text-sm font-medium text-teal-800">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="font-display font-semibold text-slate-900 mb-3">Facility type</h2>
                  <span className="badge badge-blue text-sm px-3 py-1">{hospital.type}</span>
                </div>
              </div>
            )}

            {/* ── Hours & Contact Tab ────────────────────────────────────── */}
            {tab === 'hours' && (
              <div className="space-y-4">
                <div className="card p-6">
                  <h2 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-teal-600" /> Opening Hours
                  </h2>
                  <pre className="text-sm text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
                    {hospital.hours}
                  </pre>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={clsx('h-2.5 w-2.5 rounded-full', hospital.openNow ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300')} />
                    <span className={clsx('text-sm font-semibold', hospital.openNow ? 'text-emerald-600' : 'text-slate-500')}>
                      {hospital.openNow ? 'Currently open' : 'Currently closed'}
                    </span>
                  </div>
                </div>

                <div className="card p-6 space-y-4">
                  <h2 className="font-display font-semibold text-slate-900 flex items-center gap-2">
                    <Phone size={18} className="text-teal-600" /> Contact
                  </h2>
                  <a href={`tel:${hospital.phone}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50 transition">
                    <Phone size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-700">{hospital.phone}</span>
                  </a>
                  <a href={`mailto:${hospital.email}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50 transition">
                    <Mail size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-700">{hospital.email}</span>
                  </a>
                  <div className="flex items-start gap-3 rounded-xl border border-slate-200 px-4 py-3">
                    <MapPin size={16} className="text-slate-400 mt-0.5" />
                    <span className="text-sm text-slate-700">{hospital.address}</span>
                  </div>
                </div>

                {/* Book CTA */}
                <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-600 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-lg">Ready to book?</h3>
                    <p className="text-teal-100 text-sm mt-0.5">View available doctors and pick your slot.</p>
                  </div>
                  <button onClick={() => setTab('doctors')}
                    className="btn-primary bg-white text-teal-700 hover:bg-teal-50 shrink-0">
                    <Calendar size={15} /> See Doctors
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <PatientBottomNav />
    </div>
  );
}


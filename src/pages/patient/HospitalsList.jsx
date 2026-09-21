import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PatientSidebar, PatientBottomNav, MobileTopBar } from '../../components/layout/Layout';
import { EmptyState, SkeletonCard } from '../../components/ui/Primitives';
import { HOSPITALS } from '../../lib/mockData';
import {
  Search, MapPin, Star, ChevronRight,
  ShieldCheck, Clock, SlidersHorizontal, X
} from 'lucide-react';
import clsx from 'clsx';

const STATES   = ['All States', 'Lagos', 'FCT', 'Abuja'];
const TYPES    = ['All Types', 'Private', 'Specialist', 'Government'];
const SPECS    = ['All Specialties', 'Family Medicine', "Women's Health", 'Paediatrics', 'Cardiology', 'Dermatology', 'General Practice'];

function HospitalCard({ hospital }) {
  return (
    <Link to={`/hospitals/${hospital.id}`}
      className="card-hover flex flex-col sm:flex-row gap-0 overflow-hidden">
      {/* Colour band */}
      <div className={`bg-gradient-to-br ${hospital.gradient} flex shrink-0 items-center justify-center
        sm:w-28 h-24 sm:h-auto`}>
        <span className="font-display text-3xl font-extrabold text-white/90">{hospital.initials}</span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-slate-900">{hospital.name}</h3>
                {hospital.verified && (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-teal-700">
                    <ShieldCheck size={13} /> Verified
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={11} />
                <span>{hospital.address}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 shrink-0 mt-1" />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {hospital.specialties.map(s => (
              <span key={s} className="badge badge-slate">{s}</span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Star size={12} fill="#f59e0b" className="text-amber-400" />
            <strong className="text-slate-700">{hospital.rating}</strong> ({hospital.reviews})
          </span>
          <span>{hospital.doctors} doctors</span>
          <span className="flex items-center gap-1">
            <span className={clsx('h-2 w-2 rounded-full', hospital.openNow ? 'bg-emerald-400' : 'bg-slate-300')} />
            {hospital.openNow ? 'Open now' : 'Closed'}
          </span>
          <span className="badge badge-slate capitalize">{hospital.type}</span>
        </div>
      </div>
    </Link>
  );
}

export default function HospitalsList() {
  const [search, setSearch]         = useState('');
  const [selectedState, setState]   = useState('All States');
  const [selectedType, setType]     = useState('All Types');
  const [selectedSpec, setSpec]     = useState('All Specialties');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return HOSPITALS.filter(h => {
      const matchQ    = !q || h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q) || h.specialties.some(s => s.toLowerCase().includes(q));
      const matchState = selectedState === 'All States' || h.state === selectedState;
      const matchType  = selectedType  === 'All Types'  || h.type  === selectedType;
      const matchSpec  = selectedSpec  === 'All Specialties' || h.specialties.includes(selectedSpec);
      return matchQ && matchState && matchType && matchSpec;
    });
  }, [search, selectedState, selectedType, selectedSpec]);

  const hasFilters = search || selectedState !== 'All States' || selectedType !== 'All Types' || selectedSpec !== 'All Specialties';

  const clearFilters = () => {
    setSearch(''); setState('All States'); setType('All Types'); setSpec('All Specialties');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title="Hospitals" />

        {/* Desktop page header */}
        <div className="hidden lg:block border-b border-slate-200 bg-white px-8 py-6">
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-4">Find a Hospital</h1>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" className="input pl-10"
                placeholder="Search hospitals, specialties, or locations…"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <select className="input w-auto" value={selectedState} onChange={e => setState(e.target.value)}>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="input w-auto" value={selectedType} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" className="input pl-10 text-sm"
              placeholder="Search hospitals…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {SPECS.map(s => (
              <button key={s} onClick={() => setSpec(s)}
                className={clsx('shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition',
                  selectedSpec === s ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-slate-400">{filtered.length} hospital{filtered.length !== 1 ? 's' : ''} found</p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs font-medium text-teal-600 hover:underline">
                  Clear filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <EmptyState icon={Search} title="No hospitals match your search"
                description="Try different keywords or clear your filters."
                action={<button onClick={clearFilters} className="btn-secondary">Clear filters</button>} />
            ) : (
              <div className="space-y-4">
                {filtered.map(h => <HospitalCard key={h.id} hospital={h} />)}
              </div>
            )}
          </div>
        </main>
      </div>

      <PatientBottomNav />
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { PatientSidebar, PatientBottomNav, MobileTopBar } from '../../components/layout/Layout';
import { Avatar, SkeletonCard, EmptyState } from '../../components/ui/Primitives';
import { Search, MapPin, Star, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import clsx from 'clsx';

const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Adaeze Okafor', specialty: 'Family Medicine', hospital: 'Lagos Family Health', address: 'Ikeja, Lagos', rating: 4.9, reviews: 128, fee: '₦8,000', availability: 'Today', avatarColor: 'teal' },
  { id: '2', name: 'Dr. Tolu Adebayo', specialty: "Women's Health", hospital: 'VI Wellness Clinic', address: 'Victoria Island, Lagos', rating: 4.8, reviews: 96, fee: '₦12,000', availability: 'Tomorrow', avatarColor: 'violet' },
  { id: '3', name: 'Dr. Chinedu Eze', specialty: 'General Practice', hospital: 'Abuja Care Clinic', address: 'Wuse 2, Abuja', rating: 4.7, reviews: 74, fee: '₦7,500', availability: 'Today', avatarColor: 'blue' },
  { id: '4', name: 'Dr. Emeka Nwosu', specialty: 'Cardiology', hospital: 'Heart & Vascular Centre', address: 'Lekki, Lagos', rating: 4.9, reviews: 211, fee: '₦20,000', availability: 'Wed', avatarColor: 'rose' },
  { id: '5', name: 'Dr. Fatima Musa', specialty: 'Paediatrics', hospital: 'Children\'s Wellness Hub', address: 'Garki, Abuja', rating: 4.6, reviews: 55, fee: '₦9,500', availability: 'Today', avatarColor: 'amber' },
];

const SPECIALTIES = ['All', 'Family Medicine', "Women's Health", 'General Practice', 'Cardiology', 'Paediatrics', 'Dermatology', 'Dentistry'];

function DoctorCard({ doc }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/patient/book/${doc.id}`)}
      className="card-hover p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <Avatar name={doc.name} size="lg" color={doc.avatarColor || 'teal'} />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900">{doc.name}</h3>
        <p className="text-sm text-teal-600 font-medium">{doc.specialty}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1"><MapPin size={12} />{doc.hospital}</span>
          <span className="flex items-center gap-1"><MapPin size={12} />{doc.address}</span>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <Star size={12} fill="#f59e0b" className="text-amber-400" />
          <span className="text-xs font-semibold text-slate-700">{doc.rating}</span>
          <span className="text-xs text-slate-400">({doc.reviews} reviews)</span>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
        <div className="text-right">
          <p className="font-display font-bold text-slate-900">{doc.fee}</p>
          <p className="text-xs text-slate-400">per consultation</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-600">{doc.availability}</span>
        </div>
        <ChevronRight size={18} className="text-slate-300 hidden sm:block" />
      </div>
    </div>
  );
}

export default function DoctorSearch() {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => fetchDoctors(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDoctors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('doctors')
      .select('id, name, specialties(name), hospitals(name, address)')
      .ilike('name', `%${search}%`);

    if (error || !data || data.length === 0) {
      const q = search.toLowerCase();
      const sp = selectedSpecialty;
      setDoctors(MOCK_DOCTORS.filter(d =>
        (!q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q)) &&
        (sp === 'All' || d.specialty === sp)
      ));
    } else {
      setDoctors(data.map(d => ({
        id: d.id, name: d.name, specialty: d.specialties?.name,
        hospital: d.hospitals?.name, address: d.hospitals?.address,
        rating: 4.7, reviews: 0, fee: 'N/A', availability: 'Check slots',
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchDoctors(); }, [selectedSpecialty]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title="Find a Doctor" onBack={() => navigate(-1)} />

        {/* Desktop header + search */}
        <div className="hidden lg:block border-b border-slate-200 bg-white px-8 py-6">
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-4">Find a Doctor</h1>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text"
                className="input pl-10"
                placeholder="Search by name, specialty, or clinic…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <button className="btn-secondary gap-2">
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden px-4 pt-4 bg-white border-b border-slate-200 pb-4">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text"
              className="input pl-10"
              placeholder="Search doctors, specialties…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Specialty chips */}
        <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {SPECIALTIES.map(sp => (
              <button key={sp}
                onClick={() => setSelectedSpecialty(sp)}
                className={clsx(
                  'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition',
                  selectedSpecialty === sp
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}>
                {sp}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          {loading ? (
            <div className="space-y-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : doctors.length === 0 ? (
            <EmptyState icon={Search} title="No doctors found"
              description="Try adjusting your search or filters." />
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-medium">{doctors.length} results</p>
              {doctors.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
            </div>
          )}
        </main>
      </div>

      <PatientBottomNav />
    </div>
  );
}

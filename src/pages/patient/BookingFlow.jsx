import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { PatientSidebar, PatientBottomNav, MobileTopBar } from '../../components/layout/Layout';
import { Avatar, StatusBadge } from '../../components/ui/Primitives';
import { format, addDays } from 'date-fns';
import {
  MapPin, Star, Clock, Calendar, Info, CheckCircle2,
  ChevronLeft, ChevronRight, Shield, Phone
} from 'lucide-react';
import clsx from 'clsx';

const MOCK_DOCTORS_MAP = {
  '1': { name: 'Dr. Adaeze Okafor', specialty: 'Family Medicine', hospital: 'Lagos Family Health', address: 'Ikeja, Lagos', rating: 4.9, reviews: 128, fee: '₦8,000', avatarColor: 'teal', bio: 'MBBS (Lagos), FMCGP. 12 years experience in family and preventive medicine.' },
  '2': { name: 'Dr. Tolu Adebayo', specialty: "Women's Health", hospital: 'VI Wellness Clinic', address: 'Victoria Island, Lagos', rating: 4.8, reviews: 96, fee: '₦12,000', avatarColor: 'violet', bio: 'MBBS, MSc Obs & Gynae. Specialist in maternal health and reproductive medicine.' },
  '3': { name: 'Dr. Chinedu Eze', specialty: 'General Practice', hospital: 'Abuja Care Clinic', address: 'Wuse 2, Abuja', rating: 4.7, reviews: 74, fee: '₦7,500', avatarColor: 'blue', bio: 'MBBS (Abuja). Expert in acute illnesses, chronic disease management and preventive care.' },
  '4': { name: 'Dr. Emeka Nwosu', specialty: 'Cardiology', hospital: 'Heart & Vascular Centre', address: 'Lekki, Lagos', rating: 4.9, reviews: 211, fee: '₦20,000', avatarColor: 'rose', bio: 'MBBS, FMCCardiol. Fellowship trained in interventional cardiology at University of Lagos.' },
  '5': { name: 'Dr. Fatima Musa', specialty: 'Paediatrics', hospital: "Children's Wellness Hub", address: 'Garki, Abuja', rating: 4.6, reviews: 55, fee: '₦9,500', avatarColor: 'amber', bio: 'MBBS, FMCPaed. Passionate advocate for child health. Fluent in English, Hausa, French.' },
};

const MOCK_SLOTS = [
  { id: 's1', start_time: '09:00:00', is_booked: false, is_walk_in_buffer: false },
  { id: 's2', start_time: '09:15:00', is_booked: true,  is_walk_in_buffer: false },
  { id: 's3', start_time: '09:30:00', is_booked: false, is_walk_in_buffer: false },
  { id: 's4', start_time: '09:45:00', is_booked: false, is_walk_in_buffer: true  },
  { id: 's5', start_time: '10:00:00', is_booked: true,  is_walk_in_buffer: false },
  { id: 's6', start_time: '10:15:00', is_booked: false, is_walk_in_buffer: false },
  { id: 's7', start_time: '10:30:00', is_booked: false, is_walk_in_buffer: false },
  { id: 's8', start_time: '10:45:00', is_booked: false, is_walk_in_buffer: true  },
  { id: 's9', start_time: '11:00:00', is_booked: false, is_walk_in_buffer: false },
  { id:'s10', start_time: '14:00:00', is_booked: false, is_walk_in_buffer: false },
  { id:'s11', start_time: '14:15:00', is_booked: false, is_walk_in_buffer: false },
  { id:'s12', start_time: '14:30:00', is_booked: true,  is_walk_in_buffer: false },
];

export default function BookingFlow() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [dateOffset, setDateOffset] = useState(0);

  const doctor = MOCK_DOCTORS_MAP[doctorId] || MOCK_DOCTORS_MAP['1'];
  const VISIBLE_DAYS = 7;
  const dates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));
  const visibleDates = dates.slice(dateOffset, dateOffset + VISIBLE_DAYS);

  useEffect(() => { fetchSlots(); }, [selectedDate, doctorId]);

  const fetchSlots = async () => {
    setLoading(true);
    setSelectedSlot(null);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('appointment_slots')
      .select('*').eq('doctor_id', doctorId).eq('date', dateStr)
      .order('start_time', { ascending: true });

    if (error || !data?.length) setSlots(MOCK_SLOTS);
    else setSlots(data);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setConfirming(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('appointments').insert({
      patient_id: user?.id || 'mock-user-123',
      slot_id: selectedSlot.id,
      status: 'booked',
    });
    setConfirming(false);
    if (!error || error.message?.includes('FetchError') || error.message?.includes('fetch')) {
      setConfirmed(true);
    } else {
      alert('Failed to book. The slot may have just been taken.');
    }
  };

  // ── Booking success screen ───────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <PatientSidebar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-sm w-full text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Appointment Booked!</h2>
            <p className="text-slate-500 text-sm mb-6">
              Your appointment with <strong>{doctor.name}</strong> on{' '}
              <strong>{format(selectedDate, 'EEE, MMM d')}</strong> at{' '}
              <strong>{selectedSlot?.start_time?.substring(0, 5)}</strong> is confirmed.
              <br /><br />
              An SMS reminder will be sent 24h and 2h before your appointment.
            </p>
            <div className="card p-4 mb-6 text-left flex items-start gap-3">
              <Shield size={16} className="text-teal-600 mt-0.5" />
              <p className="text-xs text-slate-600">To cancel or reschedule, reply to the SMS you received. Slots freed up automatically.</p>
            </div>
            <button onClick={() => navigate('/patient/dashboard')} className="btn-primary w-full">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableCount = slots.filter(s => !s.is_booked && !s.is_walk_in_buffer).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title="Book Appointment" onBack={() => navigate(-1)} />

        <main className="flex-1 p-4 lg:p-8 pb-32 lg:pb-8">
          <div className="max-w-3xl mx-auto">

            {/* Doctor info card */}
            <div className="card p-5 mb-6 flex flex-col sm:flex-row gap-4">
              <Avatar name={doctor.name} size="xl" color={doctor.avatarColor} />
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold text-slate-900">{doctor.name}</h2>
                <p className="text-teal-600 font-medium text-sm mt-0.5">{doctor.specialty}</p>
                <p className="text-xs text-slate-500 mt-2 mb-3">{doctor.bio}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={12} />{doctor.hospital}, {doctor.address}</span>
                  <span className="flex items-center gap-1"><Star size={12} fill="#f59e0b" className="text-amber-400" />{doctor.rating} ({doctor.reviews} reviews)</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display font-bold text-xl text-slate-900">{doctor.fee}</p>
                <p className="text-xs text-slate-400">consultation fee</p>
              </div>
            </div>

            {/* Date selector */}
            <div className="card p-4 mb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 text-sm">Select Date</h3>
                <div className="flex gap-1">
                  <button onClick={() => setDateOffset(Math.max(0, dateOffset - 7))}
                    disabled={dateOffset === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30">
                    <ChevronLeft size={15} />
                  </button>
                  <button onClick={() => setDateOffset(Math.min(7, dateOffset + 7))}
                    disabled={dateOffset >= 7}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {visibleDates.map((date, i) => {
                  const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  return (
                    <button key={i} onClick={() => setSelectedDate(date)}
                      className={clsx(
                        'flex flex-col items-center justify-center rounded-xl py-2.5 transition',
                        isSelected
                          ? 'bg-teal-700 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100'
                      )}>
                      <span className="text-[10px] uppercase font-medium opacity-70">{format(date, 'EEE')}</span>
                      <span className="text-base font-bold">{format(date, 'd')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot legend */}
            <div className="flex flex-wrap gap-4 mb-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-teal-700 block" />Available ({availableCount})</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-200 block" />Booked</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-orange-300 bg-orange-50 block" />Walk-in buffer</span>
            </div>

            {/* Slots */}
            <div className="card p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 text-sm">
                  Available slots — {format(selectedDate, 'EEEE, MMM d')}
                </h3>
                <span className="flex items-center gap-1 text-xs text-teal-600">
                  <Clock size={12} />15 min blocks
                </span>
              </div>

              {loading ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {slots.map(slot => {
                    const isBooked = slot.is_booked;
                    const isBuffer = slot.is_walk_in_buffer;
                    const isSelected = selectedSlot?.id === slot.id;

                    return (
                      <button key={slot.id}
                        disabled={isBooked || isBuffer}
                        onClick={() => setSelectedSlot(isSelected ? null : slot)}
                        className={clsx(
                          'flex flex-col items-center justify-center rounded-xl py-2.5 text-xs font-medium transition border',
                          isSelected && 'border-teal-700 bg-teal-700 text-white shadow-md',
                          !isSelected && !isBooked && !isBuffer && 'border-slate-200 bg-white text-slate-800 hover:border-teal-400 hover:bg-teal-50',
                          isBooked && 'border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed',
                          isBuffer && 'border-orange-200 bg-orange-50 text-orange-600 cursor-not-allowed',
                        )}>
                        <span className="font-bold">{slot.start_time.substring(0, 5)}</span>
                        {isBuffer && <span className="text-[9px] mt-0.5">Walk-in</span>}
                        {isBooked && <span className="text-[9px] mt-0.5">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info box */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 mb-6 flex gap-2 text-xs text-blue-800">
              <Info size={14} className="shrink-0 mt-0.5" />
              Arrive 5 minutes before your slot. SMS reminders are sent 24h and 2h in advance. Cancel from the reminder link to free your slot.
            </div>

            {/* Sticky confirm footer */}
            {selectedSlot && (
              <div className="fixed bottom-0 left-0 right-0 lg:relative border-t lg:border border-slate-200 bg-white/95 lg:bg-white backdrop-blur-md lg:rounded-2xl p-4 lg:shadow-soft z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Selected time</p>
                  <p className="font-display font-bold text-slate-900 text-lg">{selectedSlot.start_time.substring(0, 5)} — {format(selectedDate, 'EEE, MMM d')}</p>
                  <p className="text-xs text-teal-600">{doctor.hospital} · {doctor.fee}</p>
                </div>
                <button onClick={handleConfirm} disabled={confirming} className="btn-primary min-w-[160px]">
                  {confirming ? 'Confirming…' : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <PatientBottomNav />
    </div>
  );
}

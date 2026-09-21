import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Auth
const PhoneLogin = lazy(() => import('./components/auth/PhoneLogin'));

// Patient pages
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));
const DoctorSearch     = lazy(() => import('./pages/patient/DoctorSearch'));
const BookingFlow      = lazy(() => import('./pages/patient/BookingFlow'));
const PatientProfile   = lazy(() => import('./pages/patient/PatientProfile'));
const HospitalsList    = lazy(() => import('./pages/patient/HospitalsList'));
const HospitalDetail   = lazy(() => import('./pages/patient/HospitalDetail'));

// Admin pages
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const DailyQueue       = lazy(() => import('./pages/admin/DailyQueue'));
const ManageDoctors    = lazy(() => import('./pages/admin/ManageDoctors'));
const ClinicSettings   = lazy(() => import('./pages/admin/ClinicSettings'));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
      <p className="text-sm text-slate-500">Loading…</p>
    </div>
  </div>
);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMockLogin = () => {
    setSession({ user: { id: 'mock-user-123', phone: '+2348000000000' } });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  const authed = !!session;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* Public */}
      <Route path="/" element={!authed ? <PhoneLogin onMockLogin={handleMockLogin} /> : <Navigate to="/patient/dashboard" replace />} />

      {/* Patient */}
      <Route path="/patient/dashboard" element={authed ? <PatientDashboard /> : <Navigate to="/" replace />} />
      <Route path="/patient/search"    element={authed ? <DoctorSearch />     : <Navigate to="/" replace />} />
      <Route path="/patient/book/:doctorId" element={authed ? <BookingFlow /> : <Navigate to="/" replace />} />
      <Route path="/patient/profile"   element={authed ? <PatientProfile />   : <Navigate to="/" replace />} />

      {/* Hospitals */}
      <Route path="/hospitals"              element={authed ? <HospitalsList /> : <Navigate to="/" replace />} />
      <Route path="/hospitals/:hospitalId"  element={authed ? <HospitalDetail /> : <Navigate to="/" replace />} />

      {/* Admin */}
      <Route path="/admin/dashboard"   element={authed ? <AdminDashboard />   : <Navigate to="/" replace />} />
      <Route path="/admin/queue"       element={authed ? <DailyQueue />       : <Navigate to="/" replace />} />
      <Route path="/admin/doctors"     element={authed ? <ManageDoctors />    : <Navigate to="/" replace />} />
      <Route path="/admin/settings"    element={authed ? <ClinicSettings />   : <Navigate to="/" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={authed ? '/patient/dashboard' : '/'} replace />} />
      </Routes>
    </Suspense>
  );
}

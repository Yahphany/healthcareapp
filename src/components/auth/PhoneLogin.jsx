import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Activity, Phone, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';

export default function PhoneLogin({ onMockLogin }) {
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) setError(error.message);
    else setStep(2);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    setLoading(false);
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (hero) — hidden on mobile ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-teal-700 px-16 py-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Activity size={20} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold">CareSlot</span>
        </div>

        <div className="max-w-md">
          <h1 className="font-display text-4xl font-extrabold leading-tight mb-5">
            Book hospital appointments in minutes,<br />not hours.
          </h1>
          <p className="text-teal-100 text-base leading-relaxed mb-10">
            No more arriving at 6&nbsp;AM to queue for a morning-batch slot.
            Pick your exact 15-minute window, get SMS reminders, and walk in on time.
          </p>

          <div className="space-y-4">
            {[
              { icon: '🕐', text: 'Real time slots — 15 or 30 min blocks per doctor' },
              { icon: '📲', text: 'SMS & WhatsApp reminders — no missed appointments' },
              { icon: '🚶', text: 'Separate walk-in buffers — zero congestion at reception' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{icon}</span>
                <p className="text-sm text-teal-100">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-teal-300">© 2026 CareSlot Technologies Ltd</p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white px-6 py-12 lg:px-20">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 shadow-md mb-3">
            <Activity size={24} className="text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-slate-900">CareSlot</span>
          <p className="text-sm text-slate-500 mt-1">Appointments without the waiting room</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              {step === 1 ? 'Sign in' : 'Verify phone'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {step === 1
                ? 'Enter your Nigerian mobile number to receive a one-time code.'
                : `We sent a 6-digit code to ${phone}. Enter it below.`}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="label" htmlFor="phone">Phone Number</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <Phone size={15} className="text-slate-400" />
                  </span>
                  <input
                    id="phone" type="tel" required
                    className="input pl-10"
                    placeholder="+2348100000000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">Include country code, e.g. +234…</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending code…' : 'Send verification code'}
                <ChevronRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="label" htmlFor="token">Verification Code</label>
                <input
                  id="token" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required
                  className="input tracking-widest text-center text-xl font-bold"
                  placeholder="• • • • • •"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                <ShieldCheck size={16} />
                {loading ? 'Verifying…' : 'Verify & sign in'}
              </button>

              <button type="button" onClick={() => setStep(1)}
                className="btn-secondary w-full">
                ← Change number
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-400 text-center mb-3">Testing without a Supabase project?</p>
            <button type="button" onClick={onMockLogin}
              className="btn-secondary w-full text-teal-700 border-teal-200 bg-teal-50 hover:bg-teal-100 hover:border-teal-300">
              Enter as Demo User (Test Mode)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

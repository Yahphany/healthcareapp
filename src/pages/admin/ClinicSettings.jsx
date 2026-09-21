import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar, AdminBottomNav, MobileTopBar } from '../../components/layout/Layout';
import { Clock, Bell, Smartphone, Save } from 'lucide-react';

const Section = ({ title, description, children }) => (
  <div className="card p-6 mb-5">
    <div className="mb-5 pb-4 border-b border-slate-100">
      <h2 className="font-display font-semibold text-slate-900">{title}</h2>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, hint, children }) => (
  <div>
    <label className="label">{label}</label>
    {children}
    {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
  </div>
);

export default function ClinicSettings() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title="Settings" onBack={() => navigate('/admin/dashboard')} />

        <div className="hidden lg:block border-b border-slate-200 bg-white px-8 py-6">
          <h1 className="font-display text-2xl font-bold text-slate-900">Clinic Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure working hours, slot durations, walk-in buffers, and notifications.</p>
        </div>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 max-w-2xl">

          <Section title="Working Hours & Slots" description="Define default slot duration and walk-in buffer for all doctors. Individual overrides can be set per doctor.">
            <Field label="Default Slot Duration" hint="Patients will be able to book individual slots of this length.">
              <select className="input">
                <option>15 minutes</option>
                <option>20 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </Field>
            <Field label="Walk-in Buffer per Hour" hint="These slots are reserved for walk-in patients and cannot be booked online.">
              <select className="input">
                <option>0 mins (no buffer)</option>
                <option>15 mins</option>
                <option>30 mins</option>
              </select>
            </Field>
            <Field label="Advance Booking Window" hint="How far in advance patients can book.">
              <select className="input">
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
                <option>60 days</option>
              </select>
            </Field>
          </Section>

          <Section title="SMS & WhatsApp Reminders" description="Configure when automated reminders are sent to patients. Powered by Termii.">
            <Field label="SMS Provider">
              <select className="input">
                <option>Termii (Nigeria)</option>
                <option>Africa's Talking</option>
              </select>
            </Field>
            <Field label="Sender Name / ID">
              <input type="text" className="input" defaultValue="CareSlot" maxLength={11} />
            </Field>
            <div>
              <p className="label">Send Reminders At</p>
              <div className="space-y-2">
                {[
                  { label: 'Booking confirmation (immediately)', default: true },
                  { label: '24 hours before appointment',        default: true },
                  { label: '2 hours before appointment',         default: true },
                ].map(r => (
                  <label key={r.label} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked={r.default}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-700" />
                    <span className="text-sm text-slate-700">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Clinic Profile">
            <Field label="Clinic Name">
              <input type="text" className="input" defaultValue="Lagos Family Health" />
            </Field>
            <Field label="Address">
              <input type="text" className="input" defaultValue="12 Allen Avenue, Ikeja, Lagos" />
            </Field>
            <Field label="Contact Phone">
              <input type="tel" className="input" defaultValue="+234 813 000 0000" />
            </Field>
          </Section>

          <button onClick={handleSave} className="btn-primary w-full sm:w-auto">
            <Save size={15} />
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { PatientSidebar, PatientBottomNav, MobileTopBar } from '../../components/layout/Layout';
import { Avatar } from '../../components/ui/Primitives';
import { Phone, Bell, Shield, LogOut, ChevronRight, Edit2 } from 'lucide-react';

const MenuItem = ({ icon: Icon, label, description, onClick, danger }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-0 transition hover:bg-slate-50 text-left ${danger ? 'hover:bg-red-50' : ''}`}>
    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${danger ? 'bg-red-50' : 'bg-slate-100'}`}>
      <Icon size={16} className={danger ? 'text-red-500' : 'text-slate-600'} />
    </span>
    <div className="flex-1">
      <p className={`text-sm font-medium ${danger ? 'text-red-600' : 'text-slate-800'}`}>{label}</p>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
    <ChevronRight size={16} className="text-slate-300" />
  </button>
);

export default function PatientProfile() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <PatientSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar title="Profile" />

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 max-w-xl mx-auto w-full">
          <div className="hidden lg:block mb-8">
            <h1 className="font-display text-2xl font-bold text-slate-900">My Profile</h1>
          </div>

          {/* Profile card */}
          <div className="card p-6 mb-5 flex items-center gap-4">
            <Avatar name="Demo User" size="xl" color="teal" />
            <div className="flex-1">
              <h2 className="font-display font-bold text-slate-900 text-lg">Demo User</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Phone size={12} /> +234 800 000 0000
              </p>
              <p className="text-xs text-slate-400 mt-1">Patient since September 2026</p>
            </div>
            <button className="btn-secondary px-3">
              <Edit2 size={14} />
            </button>
          </div>

          {/* Menu */}
          <div className="card overflow-hidden mb-5">
            <MenuItem icon={Bell}   label="Notifications"        description="Manage SMS & WhatsApp reminder preferences" onClick={() => {}} />
            <MenuItem icon={Shield} label="Privacy & Security"   description="Manage your data and account security"      onClick={() => {}} />
          </div>

          <div className="card overflow-hidden">
            <MenuItem icon={LogOut} label="Log Out" danger onClick={handleLogout} />
          </div>

          <p className="text-center text-xs text-slate-300 mt-8">CareSlot v0.1.0-MVP · © 2026</p>
        </main>
      </div>

      <PatientBottomNav />
    </div>
  );
}


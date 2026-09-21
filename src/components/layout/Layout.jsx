import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Calendar, Search, User, LayoutDashboard, LogOut,
  Activity, Settings, ListOrdered, Users, X, Building2
} from 'lucide-react';
import clsx from 'clsx';

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 shadow-sm">
      <Activity size={18} className="text-white" />
    </div>
    <span className="font-display text-lg font-bold text-slate-900">CareSlot</span>
  </div>
);

// ── Desktop Sidebar ──────────────────────────────────────────────────────────
export function PatientSidebar() {
  const navigate = useNavigate();
  const links = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/hospitals',         icon: Building2,       label: 'Hospitals' },
    { to: '/patient/search',    icon: Search,          label: 'Find a Doctor' },
    { to: '/patient/profile',   icon: User,            label: 'My Profile' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 bg-white min-h-screen px-4 py-6">
      <div className="mb-8 px-2">
        <Logo />
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            clsx(isActive ? 'sidebar-link-active' : 'sidebar-link')
          }>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={handleLogout}
        className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600 mt-4">
        <LogOut size={18} /> Log out
      </button>
    </aside>
  );
}

export function AdminSidebar() {
  const navigate = useNavigate();
  const links = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/queue',     icon: ListOrdered,     label: 'Daily Queue' },
    { to: '/admin/doctors',   icon: Users,           label: 'Doctors' },
    { to: '/admin/settings',  icon: Settings,        label: 'Settings' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 bg-white min-h-screen px-4 py-6">
      <div className="mb-8 px-2">
        <Logo />
        <span className="ml-11 -mt-1 block text-xs font-medium text-teal-600">Admin Portal</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            clsx(isActive ? 'sidebar-link-active' : 'sidebar-link')
          }>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={handleLogout}
        className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600 mt-4">
        <LogOut size={18} /> Log out
      </button>
    </aside>
  );
}

// ── Mobile Top Bar ───────────────────────────────────────────────────────────
export function MobileTopBar({ title, onBack }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 py-3 lg:hidden">
      {onBack && (
        <button onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition">
          <X size={18} />
        </button>
      )}
      {!onBack && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700">
          <Activity size={15} className="text-white" />
        </div>
      )}
      <h1 className="font-display text-base font-bold text-slate-900">{title}</h1>
    </header>
  );
}

// ── Mobile Bottom Nav ────────────────────────────────────────────────────────
export function PatientBottomNav() {
  const links = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/hospitals',         icon: Building2,       label: 'Hospitals' },
    { to: '/patient/search',    icon: Search,          label: 'Doctors' },
    { to: '/patient/profile',   icon: User,            label: 'Profile' },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              clsx('flex flex-1 flex-col items-center py-2.5 gap-0.5 text-xs font-medium transition',
                isActive ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800')
            }>
            {({ isActive }) => (
              <>
                <span className={clsx('flex h-7 w-7 items-center justify-center rounded-lg transition',
                  isActive && 'bg-teal-50')}>
                  <Icon size={19} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function AdminBottomNav() {
  const links = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/queue',     icon: ListOrdered,     label: 'Queue' },
    { to: '/admin/doctors',   icon: Users,           label: 'Doctors' },
    { to: '/admin/settings',  icon: Settings,        label: 'Settings' },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              clsx('flex flex-1 flex-col items-center py-2.5 gap-0.5 text-xs font-medium transition',
                isActive ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800')
            }>
            {({ isActive }) => (
              <>
                <span className={clsx('flex h-7 w-7 items-center justify-center rounded-lg transition',
                  isActive && 'bg-teal-50')}>
                  <Icon size={19} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

// ── Desktop Page Header ──────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export { Logo };


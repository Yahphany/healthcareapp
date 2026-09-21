import React from 'react';
import clsx from 'clsx';

// ── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, trend, color = 'teal' }) {
  const colors = {
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-700',   icon: 'text-teal-600' },
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   icon: 'text-blue-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600' },
    red:    { bg: 'bg-red-50',    text: 'text-red-700',    icon: 'text-red-600' },
    slate:  { bg: 'bg-slate-100', text: 'text-slate-700',  icon: 'text-slate-600' },
  };
  const c = colors[color] || colors.teal;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className={clsx('flex h-9 w-9 items-center justify-center rounded-xl', c.bg)}>
          <Icon size={18} className={c.icon} />
        </span>
      </div>
      <div className="flex items-end justify-between">
        <p className="font-display text-3xl font-bold text-slate-900">{value}</p>
        {trend && <p className="text-xs font-medium text-emerald-600">{trend}</p>}
      </div>
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    booked:    'badge-blue',
    completed: 'badge-green',
    cancelled: 'badge-slate',
    'no-show': 'badge-red',
  };
  return (
    <span className={clsx('badge capitalize', map[status] || 'badge-slate')}>
      {status}
    </span>
  );
}

// ── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ name = '', size = 'md', color = 'teal' }) {
  const initials = name.replace('Dr.', '').trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-20 w-20 text-2xl' };
  const colors = {
    teal:   'bg-teal-100 text-teal-700',
    blue:   'bg-blue-100 text-blue-700',
    violet: 'bg-violet-100 text-violet-700',
    amber:  'bg-amber-100 text-amber-700',
    rose:   'bg-rose-100 text-rose-700',
  };
  return (
    <div className={clsx('flex shrink-0 items-center justify-center rounded-full font-display font-bold', sizes[size], colors[color] || colors.teal)}>
      {initials}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 px-8 text-center">
      {Icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <Icon size={26} className="text-slate-400" />
        </span>
      )}
      <h3 className="font-display text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-4/5 rounded bg-slate-200" />
      </div>
    </div>
  );
}

// ── Divider with label ────────────────────────────────────────────────────────
export function DividerLabel({ label }) {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-grow border-t border-slate-200" />
      <span className="mx-3 text-xs font-medium text-slate-400 shrink-0">{label}</span>
      <div className="flex-grow border-t border-slate-200" />
    </div>
  );
}


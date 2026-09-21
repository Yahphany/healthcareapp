-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Specialties
create table public.specialties (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Hospitals
create table public.hospitals (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    address text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Doctors
create table public.doctors (
    id uuid default uuid_generate_v4() primary key,
    hospital_id uuid references public.hospitals(id) on delete cascade not null,
    specialty_id uuid references public.specialties(id) on delete cascade not null,
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Availability Rules (e.g. Doctor works Monday 9am - 5pm, 15 min slots, 30 mins buffer)
create table public.availability_rules (
    id uuid default uuid_generate_v4() primary key,
    doctor_id uuid references public.doctors(id) on delete cascade not null,
    day_of_week integer not null check (day_of_week between 0 and 6), -- 0 = Sunday
    start_time time not null,
    end_time time not null,
    slot_duration_minutes integer not null default 15,
    walk_in_buffer_minutes integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Appointment Slots (Generated slots based on rules)
create table public.appointment_slots (
    id uuid default uuid_generate_v4() primary key,
    doctor_id uuid references public.doctors(id) on delete cascade not null,
    date date not null,
    start_time time not null,
    end_time time not null,
    is_walk_in_buffer boolean default false,
    is_booked boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Appointments
create table public.appointments (
    id uuid default uuid_generate_v4() primary key,
    patient_id uuid references auth.users(id) on delete cascade not null,
    slot_id uuid references public.appointment_slots(id) on delete restrict not null,
    status text not null check (status in ('booked', 'completed', 'no-show', 'cancelled')) default 'booked',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reminders Log
create table public.reminders_log (
    id uuid default uuid_generate_v4() primary key,
    appointment_id uuid references public.appointments(id) on delete cascade not null,
    reminder_type text not null check (reminder_type in ('booking', '24h', '2h')),
    sent_at timestamp with time zone default timezone('utc'::text, now()),
    status text not null default 'pending'
);

-- RLS Policies

alter table public.specialties enable row level security;
alter table public.hospitals enable row level security;
alter table public.doctors enable row level security;
alter table public.availability_rules enable row level security;
alter table public.appointment_slots enable row level security;
alter table public.appointments enable row level security;

-- Allow read access to everyone for public data
create policy "Public specialties are viewable by everyone" on public.specialties for select using (true);
create policy "Public hospitals are viewable by everyone" on public.hospitals for select using (true);
create policy "Public doctors are viewable by everyone" on public.doctors for select using (true);
create policy "Public rules are viewable by everyone" on public.availability_rules for select using (true);
create policy "Public slots are viewable by everyone" on public.appointment_slots for select using (true);

-- Patients can view and create their own appointments
create policy "Patients can view own appointments" on public.appointments for select using (auth.uid() = patient_id);
create policy "Patients can insert own appointments" on public.appointments for insert with check (auth.uid() = patient_id);
create policy "Patients can update own appointments" on public.appointments for update using (auth.uid() = patient_id);

-- Prevent booking already booked slots using a function/trigger
create or replace function check_slot_availability() returns trigger as $$
begin
    if exists (
        select 1 from public.appointment_slots
        where id = new.slot_id and is_booked = true
    ) then
        raise exception 'Slot is already booked';
    end if;
    
    update public.appointment_slots set is_booked = true where id = new.slot_id;
    return new;
end;
$$ language plpgsql;

create trigger tr_check_slot_availability
    before insert on public.appointments
    for each row execute function check_slot_availability();


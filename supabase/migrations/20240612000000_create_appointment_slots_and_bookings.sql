-- Migration: Create appointment_slots and appointment_bookings tables for physical appointment booking system

-- 1. Create appointment_slots table
create table if not exists public.appointment_slots (
  id uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  end_time timestamptz not null,
  location text not null,
  is_booked boolean not null default false,
  created_at timestamptz default now()
);

-- 2. Create appointment_bookings table
create table if not exists public.appointment_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid references public.appointment_slots(id) on delete cascade,
  user_id uuid references public.profiles(id),
  guest_name text,
  guest_email text,
  guest_phone text,
  payment_id uuid, -- optional: link to payments table
  status text default 'booked', -- e.g., booked, cancelled, completed
  created_at timestamptz default now()
); 
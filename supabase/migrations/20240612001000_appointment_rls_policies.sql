-- Migration: Enable RLS and add policies for appointment_slots and appointment_bookings

-- Enable RLS
alter table public.appointment_slots enable row level security;
alter table public.appointment_bookings enable row level security;

-- appointment_slots: Anyone can view
create policy "Allow read to all" on public.appointment_slots
  for select using (true);

-- appointment_slots: Admins can manage
create policy "Admins manage slots" on public.appointment_slots
  for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- appointment_bookings: Anyone can book
create policy "Anyone can book appointment" on public.appointment_bookings
  for insert
  with check (true);

-- appointment_bookings: Users can view their own bookings
create policy "Users can view their own bookings" on public.appointment_bookings
  for select
  using (
    (user_id = auth.uid())
    or (
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    )
  );

-- appointment_bookings: Admins can manage all
create policy "Admins manage all bookings" on public.appointment_bookings
  for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ); 
-- Tablas iniciales para sistema de turnos

create table if not exists services (
  id serial primary key,
  name text not null,
  duration_minutes int default 60
);

create table if not exists bookings (
  id bigserial primary key,
  name text not null,
  email text not null,
  service_id int references services(id) on delete set null,
  slot text not null,
  date date not null,
  created_at timestamptz default now()
);

create index if not exists idx_bookings_date on bookings(date);

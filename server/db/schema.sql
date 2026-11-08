--  CampusFix – Supabase schema

--  Users 
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  is_admin      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

--  Reports 
create table if not exists reports (
  id               uuid primary key default gen_random_uuid(),
  ref_number       text not null unique,           -- e.g. CFX-20261108-A3F9
  user_id          uuid references users(id) on delete set null,
  category         text not null,
  description      text not null,
  location         text not null,
  image_url        text,
  image_public_id  text,                           -- Cloudinary public_id for deletion
  contact          text,                           -- optional reporter contact
  status           text not null default 'Pending'
                   check (status in ('Pending', 'In Progress', 'Resolved')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Indexes for common query patterns
create index if not exists reports_status_idx    on reports(status);
create index if not exists reports_category_idx  on reports(category);
create index if not exists reports_user_id_idx   on reports(user_id);
create index if not exists reports_created_at_idx on reports(created_at desc);

--  Auto-update updated_at 
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_updated_at  on users;
create trigger users_updated_at
  before update on users
  for each row execute procedure set_updated_at();

drop trigger if exists reports_updated_at on reports;
create trigger reports_updated_at
  before update on reports
  for each row execute procedure set_updated_at();

--  Seed: default admin account 
-- Password: Admin@1234  
insert into users (name, email, password_hash, is_admin)
values (
  'Admin',
  'admin@campusfix.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHXm',
  true
)
on conflict (email) do nothing;

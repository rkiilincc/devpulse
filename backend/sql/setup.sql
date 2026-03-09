-- Run this in your Supabase SQL Editor (optional)
-- Enables automatic table discovery in DevPulse dashboard
-- Project → SQL Editor → New Query → paste → Run

create or replace function devpulse_list_tables()
returns text[]
language sql
security definer
as $$
select array_agg(table_name::text order by table_name)
from information_schema.tables
where table_schema = 'public'
and table_type = 'BASE TABLE';
$$;

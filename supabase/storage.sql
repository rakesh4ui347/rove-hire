-- Run in Supabase Dashboard → SQL Editor
-- Safe to re-run (drops and recreates policies).

insert into storage.buckets (id, name, public)
values
  ('resumes', 'resumes', false),
  ('offers', 'offers', false),
  ('nda', 'nda', false)
on conflict (id) do nothing;

-- Remove old combined policy if present
drop policy if exists "Service role full access" on storage.objects;

drop policy if exists "Service role resumes access" on storage.objects;
drop policy if exists "Service role offers access" on storage.objects;
drop policy if exists "Service role nda access" on storage.objects;

create policy "Service role resumes access"
on storage.objects
for all
to service_role
using (bucket_id = 'resumes')
with check (bucket_id = 'resumes');

create policy "Service role offers access"
on storage.objects
for all
to service_role
using (bucket_id = 'offers')
with check (bucket_id = 'offers');

create policy "Service role nda access"
on storage.objects
for all
to service_role
using (bucket_id = 'nda')
with check (bucket_id = 'nda');

-- Note: the old "documents" bucket is no longer used by this app.
-- You can delete it from Storage if it is empty.

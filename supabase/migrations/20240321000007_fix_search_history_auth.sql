-- First drop existing policies
drop policy if exists "allow_anonymous_access" on search_history;
drop policy if exists "enable_global_insert" on search_history;
drop policy if exists "enable_global_select" on search_history;
drop policy if exists "enable_delete_own_records" on search_history;

-- Temporarily disable RLS
alter table search_history disable row level security;

-- Re-enable RLS
alter table search_history enable row level security;

-- Create separate policies for different operations
create policy "enable_insert_for_all_users"
on search_history for insert
to public
with check (true);

create policy "enable_select_for_all_users"
on search_history for select
to public
using (true);

create policy "enable_delete_for_all_users"
on search_history for delete
to public
using (true);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all privileges on table search_history to anon, authenticated;
grant all privileges on sequence search_history_id_seq to anon, authenticated;
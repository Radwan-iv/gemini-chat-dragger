-- Enable RLS
alter table search_history enable row level security;

-- Create policies
create policy "Enable read access for all users"
on search_history for select
to public
using (true);

create policy "Enable insert for authenticated users"
on search_history for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Enable insert for anonymous users"
on search_history for insert
to public
with check (user_id = '00000000-0000-0000-0000-000000000000');

create policy "Enable delete for own records"
on search_history for delete
to public
using (
  user_id = coalesce(
    auth.uid()::text,
    '00000000-0000-0000-0000-000000000000'
  )
);
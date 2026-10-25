create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  event_id uuid references public.events(id) on delete cascade,
  client_id uuid references public.clients(id),
  amount numeric not null default 0,
  currency text default 'KES',
  status text check (status in ('draft','sent','partial','paid','void')) default 'draft',
  issued_at timestamp with time zone default now(),
  due_date date,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_invoices_updated_at on public.invoices;
create trigger set_invoices_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

alter table public.invoices enable row level security;

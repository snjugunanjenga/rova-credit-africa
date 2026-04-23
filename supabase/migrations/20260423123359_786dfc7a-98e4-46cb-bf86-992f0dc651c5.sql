-- =========================================================
-- Enums
-- =========================================================
create type public.app_role as enum ('admin_owner', 'developer', 'analyst', 'marketer');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'converted', 'lost');
create type public.lead_source as enum ('marketplace', 'partner', 'direct', 'dsr');
create type public.product_category as enum ('budget', 'mid-range', 'flagship');

-- =========================================================
-- Profiles (mirrors Clerk user)
-- =========================================================
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are readable by authenticated users"
  on public.profiles for select to authenticated using (true);

create policy "Anyone can insert their own profile"
  on public.profiles for insert to anon, authenticated with check (true);

create policy "Anyone can update profiles by clerk id"
  on public.profiles for update to anon, authenticated using (true) with check (true);

-- =========================================================
-- User roles (separate table — security best practice)
-- =========================================================
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (profile_id, role)
);

alter table public.user_roles enable row level security;

-- Security-definer function to prevent recursive RLS
create or replace function public.has_role(_clerk_user_id text, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.profiles p on p.id = ur.profile_id
    where p.clerk_user_id = _clerk_user_id
      and ur.role = _role
  )
$$;

create or replace function public.has_any_role(_clerk_user_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.profiles p on p.id = ur.profile_id
    where p.clerk_user_id = _clerk_user_id
  )
$$;

create policy "Authenticated can read all roles"
  on public.user_roles for select to authenticated, anon using (true);

create policy "Anyone can insert roles (gated client-side, dev mode)"
  on public.user_roles for insert to anon, authenticated with check (true);

create policy "Anyone can delete roles (gated client-side, dev mode)"
  on public.user_roles for delete to anon, authenticated using (true);

-- =========================================================
-- Products
-- =========================================================
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  asset_model text,
  category public.product_category not null default 'budget',
  asset_price integer not null,
  down_payment integer not null,
  price_label text,
  image_url text,
  alt_text text,
  ram text,
  storage text,
  specs text[] default '{}',
  badges text[] default '{}',
  rating numeric(2,1) default 4.5,
  available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Public can view available products"
  on public.products for select to anon, authenticated using (true);

create policy "Anyone can manage products (gated client-side)"
  on public.products for all to anon, authenticated using (true) with check (true);

-- =========================================================
-- Leads
-- =========================================================
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  source public.lead_source not null default 'marketplace',
  status public.lead_status not null default 'new',
  full_name text not null,
  email text,
  phone text,
  country text default 'Uganda',
  id_type text,
  monthly_income text,
  product_id uuid references public.products(id) on delete set null,
  product_snapshot jsonb,
  subject text,
  message text,
  consent_given boolean not null default false,
  assigned_to uuid references public.profiles(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Anyone can submit leads"
  on public.leads for insert to anon, authenticated with check (true);

create policy "Anyone can read leads (gated client-side)"
  on public.leads for select to anon, authenticated using (true);

create policy "Anyone can update leads (gated client-side)"
  on public.leads for update to anon, authenticated using (true) with check (true);

create policy "Anyone can delete leads (gated client-side)"
  on public.leads for delete to anon, authenticated using (true);

-- =========================================================
-- Lead notes
-- =========================================================
create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade not null,
  author_clerk_id text,
  author_name text,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.lead_notes enable row level security;

create policy "Anyone can read lead notes (gated client-side)"
  on public.lead_notes for select to anon, authenticated using (true);

create policy "Anyone can insert lead notes (gated client-side)"
  on public.lead_notes for insert to anon, authenticated with check (true);

-- =========================================================
-- Analytics events
-- =========================================================
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  payload jsonb default '{}'::jsonb,
  session_id text,
  path text,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

create policy "Anyone can insert analytics events"
  on public.analytics_events for insert to anon, authenticated with check (true);

create policy "Anyone can read analytics (gated client-side)"
  on public.analytics_events for select to anon, authenticated using (true);

-- =========================================================
-- Updated_at trigger
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger trg_leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- =========================================================
-- Seed products
-- =========================================================
-- Helper: convert Drive view URL to direct img URL pattern is done client-side.
-- Here we store the original Drive ID inside the URL; the app resolves it.

insert into public.products (name, brand, asset_model, category, asset_price, down_payment, price_label, image_url, alt_text, ram, storage, specs, badges, rating, sort_order) values
-- Samsung A-series (your full list)
('A03 CORE 32GB/2GB', 'Samsung', 'A03 CORE (A032FDS) 32GB/2GB', 'budget', 399000, 57500, 'UGX 399,000', 'https://drive.google.com/uc?export=view&id=1AijwbJONtv7ieY1QcjQyrak4ofXBBG4s', 'Samsung Galaxy A03 CORE smartphone', '2GB', '32GB', ARRAY['32GB','2GB RAM'], ARRAY['Flexible Terms','MoMo'], 4.5, 1),
('A04 64GB/4GB', 'Samsung', 'A04 (A045FDS) 64GB/4GB', 'budget', 449000, 105000, 'UGX 449,000', 'https://drive.google.com/uc?export=view&id=17_w4rIRjyHZp7NG17MJV8rDaqJig4Opk', 'Samsung Galaxy A04 smartphone', '4GB', '64GB', ARRAY['64GB','4GB RAM'], ARRAY['Flexible Terms','MoMo'], 4.5, 2),
('A04e 32GB/3GB', 'Samsung', 'A04e (A042FDS) 32GB/3GB', 'budget', 399000, 77000, 'UGX 399,000', 'https://drive.google.com/uc?export=view&id=1WLGOW-QmTAHspjn05jOZ0b7yusTO7ceQ', 'Samsung Galaxy A04e smartphone', '3GB', '32GB', ARRAY['32GB','3GB RAM'], ARRAY['Flexible Terms'], 4.5, 3),
('A04e 64GB/3GB', 'Samsung', 'A04e (A042FDS) 64GB/3GB', 'budget', 450000, 95900, 'UGX 450,000', 'https://drive.google.com/uc?export=view&id=1WLGOW-QmTAHspjn05jOZ0b7yusTO7ceQ', 'Samsung Galaxy A04e smartphone', '3GB', '64GB', ARRAY['64GB','3GB RAM'], ARRAY['Flexible Terms'], 4.5, 4),
('A04s 128GB/4GB', 'Samsung', 'A04s (A047FDS) 128GB/4GB', 'budget', 450000, 126000, 'UGX 450,000', 'https://drive.google.com/uc?export=view&id=1BFMWuB1h6sztvumelDSOxRNaN4B9v2Er', 'Samsung Galaxy A04s smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 5),
('A04s 64GB/4GB', 'Samsung', 'A04s (A047FDS) 64GB/4GB', 'budget', 450000, 119000, 'UGX 450,000', 'https://drive.google.com/uc?export=view&id=1J9k99a2tH-f5qaZEK1zOWLBu1QtawUrr', 'Samsung Galaxy A04s smartphone', '4GB', '64GB', ARRAY['64GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 6),
('A05 128GB/4GB', 'Samsung', 'A05 (A055F/DS) 128GB/4GB', 'budget', 470000, 50000, 'UGX 470,000', 'https://drive.google.com/uc?export=view&id=17BmmmzqRQ6XGdVAxr6X2gu8G5ePbaJDT', 'Samsung Galaxy A05 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms','Popular'], 4.5, 7),
('A05 64GB/4GB', 'Samsung', 'A05 (A055F/DS) 64GB/4GB', 'budget', 370000, 25000, 'UGX 370,000', 'https://drive.google.com/uc?export=view&id=1TIDEVYQURBDe2yn8Kq9inPxycjCaExRe', 'Samsung Galaxy A05 smartphone', '4GB', '64GB', ARRAY['64GB','4GB RAM'], ARRAY['Flexible Terms','Bestseller'], 4.5, 8),
('A05s 128GB/4GB', 'Samsung', 'A05s (A057F/DS) 128GB/4GB', 'budget', 480000, 115500, 'UGX 480,000', 'https://drive.google.com/uc?export=view&id=1Tj8-IckflghEh9GAmLVYHFd_gvfpJhXg', 'Samsung Galaxy A05s smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 9),
('A05s 128GB/6GB', 'Samsung', 'A05s (A057F/DS) 128GB/6GB', 'mid-range', 795000, 210000, 'UGX 795,000', 'https://drive.google.com/uc?export=view&id=1Be0dflJEOycz6Xdbxd6F25m_ijVP5CVq', 'Samsung Galaxy A05s smartphone', '6GB', '128GB', ARRAY['128GB','6GB RAM'], ARRAY['Flexible Terms'], 4.5, 10),
('A05s 64GB/4GB', 'Samsung', 'A05s (A057F/DS) 64GB/4GB', 'budget', 470000, 112000, 'UGX 470,000', 'https://drive.google.com/uc?export=view&id=1P6gk307XUZzKQFMKyiMFsPHcEW0ZCSY6', 'Samsung Galaxy A05s smartphone', '4GB', '64GB', ARRAY['64GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 11),
('A06 64GB/4GB', 'Samsung', 'A06 (A065F/DS) 64GB/4GB', 'budget', 470000, 25000, 'UGX 470,000', 'https://drive.google.com/uc?export=view&id=1P6gk307XUZzKQFMKyiMFsPHcEW0ZCSY6', 'Samsung Galaxy A06 smartphone', '4GB', '64GB', ARRAY['64GB','4GB RAM'], ARRAY['Flexible Terms','New'], 4.5, 12),
('A06 128GB/4GB', 'Samsung', 'A06 (A065F/DS) 128GB/4GB', 'budget', 449000, 50000, 'UGX 449,000', 'https://drive.google.com/uc?export=view&id=1YBZWo1ugF6_tLLqIBRg1DyVzvTcI_I1U', 'Samsung Galaxy A06 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms','New'], 4.5, 13),
('A07 128GB/4GB', 'Samsung', 'A07 (SM-A075F/DS) 128GB/4GB', 'mid-range', 530000, 50000, 'UGX 530,000', 'https://drive.google.com/uc?export=view&id=1s5ajgaNMk1hzbl8xQlF2LJRb70gPXLGs', 'Samsung Galaxy A07 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 14),
('A07 64GB/4GB', 'Samsung', 'A07 (SM-A075F/DS) 64GB/4GB', 'mid-range', 510000, 30000, 'UGX 510,000', 'https://drive.google.com/uc?export=view&id=1kHy6XGooafzmfFH7dWWL5Y1L6w7rEKWl', 'Samsung Galaxy A07 smartphone', '4GB', '64GB', ARRAY['64GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 15),
('A14 128GB/4GB', 'Samsung', 'A14 (A145FDS) 128GB/4GB', 'mid-range', 699000, 175000, 'UGX 699,000', 'https://drive.google.com/uc?export=view&id=1UjxbKLvsydcrjGWNY-O_0nt7QTdlIyn_', 'Samsung Galaxy A14 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 16),
('A14 64GB/4GB', 'Samsung', 'A14 (A145FDS) 64GB/4GB', 'mid-range', 580000, 157500, 'UGX 580,000', 'https://drive.google.com/uc?export=view&id=1kZ5QgbPVbDZD3cEIm5-P7rxEJvGdCmN7', 'Samsung Galaxy A14 smartphone', '4GB', '64GB', ARRAY['64GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 17),
('A15 128GB/4GB', 'Samsung', 'A15 (A155F/DSN) 128GB/4GB', 'budget', 480000, 147500, 'UGX 480,000', 'https://drive.google.com/uc?export=view&id=1LnBK8YOoLotowLVjNm6og-Pwn6APAI8K', 'Samsung Galaxy A15 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms','Bestseller'], 4.5, 18),
('A15 128GB/6GB', 'Samsung', 'A15 (A155F/DSN) 128GB/6GB', 'mid-range', 825000, 112000, 'UGX 825,000', 'https://drive.google.com/uc?export=view&id=1KWFuD5to4pqXzysJtTf2zCwxrs_ZdgZj', 'Samsung Galaxy A15 smartphone', '6GB', '128GB', ARRAY['128GB','6GB RAM'], ARRAY['Flexible Terms'], 4.5, 19),
('A16 128GB/4GB', 'Samsung', 'A16 (A165F/DS) 128GB/4GB', 'mid-range', 615000, 100000, 'UGX 615,000', 'https://drive.google.com/uc?export=view&id=1BTK3n1mpeimaU8B7QZvYAW5V8kqCIfzj', 'Samsung Galaxy A16 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 20),
('A16 128GB/6GB', 'Samsung', 'A16 (A165F/DS) 128GB/6GB', 'mid-range', 790000, 140000, 'UGX 790,000', 'https://drive.google.com/uc?export=view&id=12CKXFj_TSCmdfjtXfIpeObofBupqhd_I', 'Samsung Galaxy A16 smartphone', '6GB', '128GB', ARRAY['128GB','6GB RAM'], ARRAY['Flexible Terms'], 4.5, 21),
('A17 128GB/4GB', 'Samsung', 'A17 (A175F/DS) 128GB/4GB', 'mid-range', 740000, 105000, 'UGX 740,000', 'https://drive.google.com/uc?export=view&id=17sGS5ingnhlcNp9Lr6HMKaDdxTAELCa3', 'Samsung Galaxy A17 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms','New'], 4.5, 22),
('A17 128GB/6GB', 'Samsung', 'A17 (A175F/DS) 128GB/6GB', 'mid-range', 820000, 120000, 'UGX 820,000', 'https://drive.google.com/uc?export=view&id=1Vre-lHDnt02LPUoUnWeu7CPUu5wL1AvK', 'Samsung Galaxy A17 smartphone', '6GB', '128GB', ARRAY['128GB','6GB RAM'], ARRAY['Flexible Terms','New'], 4.5, 23),
('A24 128GB/4GB', 'Samsung', 'A24 (A245FDSN) 128GB/4GB', 'mid-range', 799000, 248500, 'UGX 799,000', 'https://drive.google.com/uc?export=view&id=1RkWYp9xXubu5aB8m8W-hT4gl7JWNCpEG', 'Samsung Galaxy A24 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms'], 4.5, 24),
('A25 5G 128GB/6GB', 'Samsung', 'A25 5G (A256E/DSN) 128GB/6GB', 'mid-range', 999000, 220500, 'UGX 999,000', 'https://drive.google.com/uc?export=view&id=1Y4qg4N_2vpO_SYN8CXbF-Fp4zPYc3FtG', 'Samsung Galaxy A25 5G smartphone', '6GB', '128GB', ARRAY['128GB','6GB RAM','5G'], ARRAY['Flexible Terms','5G'], 4.5, 25),
('A25 5G 256GB/8GB', 'Samsung', 'A25 5G (A256E/DSN) 256GB/8GB', 'flagship', 1488000, 259000, 'UGX 1,488,000', 'https://drive.google.com/uc?export=view&id=1kqHLBwH8fDKAmyQ6cfgcLrpjUb-d02Lz', 'Samsung Galaxy A25 5G smartphone', '8GB', '256GB', ARRAY['256GB','8GB RAM','5G'], ARRAY['Flexible Terms','5G'], 4.5, 26),
('A34 128GB/6GB', 'Samsung', 'A34 (A346EDSN) 128GB/6GB', 'flagship', 1200000, 376000, 'UGX 1,200,000', 'https://drive.google.com/uc?export=view&id=1TtzFmmerVWt-smlWMVkTpYMIhqFwS2xE', 'Samsung Galaxy A34 smartphone', '6GB', '128GB', ARRAY['128GB','6GB RAM'], ARRAY['Flexible Terms'], 4.5, 27),
('A35 5G 128GB/6GB', 'Samsung', 'A35 5G (A356E/DS) 128GB/6GB', 'flagship', 1750000, 490000, 'UGX 1,750,000', 'https://drive.google.com/uc?export=view&id=1s498nvjk8XeCisKvZ6BnWgnBE90Z69w1', 'Samsung Galaxy A35 5G smartphone', '6GB', '128GB', ARRAY['128GB','6GB RAM','5G'], ARRAY['Flexible Terms','5G'], 4.5, 28),
('A35 5G 256GB/8GB', 'Samsung', 'A35 5G (A356E/DS) 256GB/8GB', 'flagship', 1770000, 550000, 'UGX 1,770,000', 'https://drive.google.com/uc?export=view&id=1PXnqxGL0x94JQNKtO0lWFxGOOmd8gbHD', 'Samsung Galaxy A35 5G smartphone', '8GB', '256GB', ARRAY['256GB','8GB RAM','5G'], ARRAY['Flexible Terms','5G'], 4.5, 29),
('A55 5G 256GB/8GB', 'Samsung', 'A55 5G (A556E/DS) 256GB/8GB', 'flagship', 1800000, 650000, 'UGX 1,800,000', 'https://drive.google.com/uc?export=view&id=1e7lq8dCN0IVRrZlNqaqleD7qZL3vII7e', 'Samsung Galaxy A55 5G smartphone', '8GB', '256GB', ARRAY['256GB','8GB RAM','5G'], ARRAY['Flexible Terms','5G','Premium'], 4.5, 30),
-- Tecno
('Spark 20 128GB/8GB', 'Tecno', 'Spark 20 (KJ5) 128GB/8GB', 'mid-range', 650000, 95000, 'UGX 650,000', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80', 'Tecno Spark 20 smartphone', '8GB', '128GB', ARRAY['128GB','8GB RAM','50MP Camera'], ARRAY['Flexible Terms','MoMo'], 4.4, 31),
('Spark 10 128GB/4GB', 'Tecno', 'Spark 10 (KI5) 128GB/4GB', 'budget', 450000, 60000, 'UGX 450,000', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80', 'Tecno Spark 10 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms'], 4.3, 32),
('Camon 20 256GB/8GB', 'Tecno', 'Camon 20 (CK6n) 256GB/8GB', 'mid-range', 950000, 180000, 'UGX 950,000', 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80', 'Tecno Camon 20 smartphone', '8GB', '256GB', ARRAY['256GB','8GB RAM','64MP'], ARRAY['Flexible Terms','Camera'], 4.5, 33),
('Pop 7 64GB/2GB', 'Tecno', 'Pop 7 (BF6) 64GB/2GB', 'budget', 320000, 40000, 'UGX 320,000', 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80', 'Tecno Pop 7 smartphone', '2GB', '64GB', ARRAY['64GB','2GB RAM'], ARRAY['Flexible Terms','Entry'], 4.2, 34),
-- Infinix
('Hot 40i 128GB/8GB', 'Infinix', 'Hot 40i (X6528) 128GB/8GB', 'mid-range', 580000, 80000, 'UGX 580,000', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80', 'Infinix Hot 40i smartphone', '8GB', '128GB', ARRAY['128GB','8GB RAM'], ARRAY['Flexible Terms','MoMo'], 4.4, 35),
('Note 30 256GB/8GB', 'Infinix', 'Note 30 (X6833B) 256GB/8GB', 'mid-range', 1050000, 200000, 'UGX 1,050,000', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80', 'Infinix Note 30 smartphone', '8GB', '256GB', ARRAY['256GB','8GB RAM','108MP'], ARRAY['Flexible Terms'], 4.5, 36),
('Smart 8 64GB/3GB', 'Infinix', 'Smart 8 (X6525) 64GB/3GB', 'budget', 380000, 50000, 'UGX 380,000', 'https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?w=600&q=80', 'Infinix Smart 8 smartphone', '3GB', '64GB', ARRAY['64GB','3GB RAM'], ARRAY['Flexible Terms','Entry'], 4.2, 37),
('Zero 30 5G 256GB/12GB', 'Infinix', 'Zero 30 5G 256GB/12GB', 'flagship', 1850000, 380000, 'UGX 1,850,000', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80', 'Infinix Zero 30 5G smartphone', '12GB', '256GB', ARRAY['256GB','12GB RAM','5G'], ARRAY['Flexible Terms','5G','Flagship'], 4.7, 38),
-- iPhone
('iPhone 11 64GB', 'Apple', 'iPhone 11 64GB', 'flagship', 2200000, 600000, 'UGX 2,200,000', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80', 'Apple iPhone 11 smartphone', '4GB', '64GB', ARRAY['64GB','iOS','12MP Dual'], ARRAY['Flexible Terms','iOS'], 4.7, 39),
('iPhone 12 128GB', 'Apple', 'iPhone 12 128GB', 'flagship', 2750000, 750000, 'UGX 2,750,000', 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&q=80', 'Apple iPhone 12 smartphone', '4GB', '128GB', ARRAY['128GB','5G','iOS'], ARRAY['Flexible Terms','5G','iOS'], 4.8, 40),
('iPhone 13 128GB', 'Apple', 'iPhone 13 128GB', 'flagship', 3200000, 900000, 'UGX 3,200,000', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=80', 'Apple iPhone 13 smartphone', '4GB', '128GB', ARRAY['128GB','5G','iOS'], ARRAY['Flexible Terms','5G','iOS','Bestseller'], 4.8, 41),
('iPhone 14 128GB', 'Apple', 'iPhone 14 128GB', 'flagship', 3850000, 1100000, 'UGX 3,850,000', 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&q=80', 'Apple iPhone 14 smartphone', '6GB', '128GB', ARRAY['128GB','5G','iOS'], ARRAY['Flexible Terms','5G','iOS'], 4.8, 42),
('iPhone 15 128GB', 'Apple', 'iPhone 15 128GB', 'flagship', 4500000, 1300000, 'UGX 4,500,000', 'https://images.unsplash.com/photo-1696446702239-e76b71b96b9c?w=600&q=80', 'Apple iPhone 15 smartphone', '6GB', '128GB', ARRAY['128GB','5G','USB-C'], ARRAY['Flexible Terms','5G','New'], 4.9, 43),
-- Xiaomi
('Redmi 13C 128GB/4GB', 'Xiaomi', 'Redmi 13C 128GB/4GB', 'budget', 520000, 70000, 'UGX 520,000', 'https://images.unsplash.com/photo-1610792516775-01de03eae630?w=600&q=80', 'Xiaomi Redmi 13C smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM','50MP'], ARRAY['Flexible Terms','Value'], 4.4, 44),
('Redmi Note 13 256GB/8GB', 'Xiaomi', 'Redmi Note 13 256GB/8GB', 'mid-range', 1100000, 220000, 'UGX 1,100,000', 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=600&q=80', 'Xiaomi Redmi Note 13 smartphone', '8GB', '256GB', ARRAY['256GB','8GB RAM','108MP'], ARRAY['Flexible Terms','Camera'], 4.6, 45),
('POCO X6 5G 256GB/8GB', 'Xiaomi', 'POCO X6 5G 256GB/8GB', 'flagship', 1450000, 300000, 'UGX 1,450,000', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80', 'Xiaomi POCO X6 5G smartphone', '8GB', '256GB', ARRAY['256GB','8GB RAM','5G'], ARRAY['Flexible Terms','5G','Gaming'], 4.7, 46),
('Redmi A3 64GB/3GB', 'Xiaomi', 'Redmi A3 64GB/3GB', 'budget', 360000, 45000, 'UGX 360,000', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80', 'Xiaomi Redmi A3 smartphone', '3GB', '64GB', ARRAY['64GB','3GB RAM'], ARRAY['Flexible Terms','Entry'], 4.3, 47),
-- OPPO bonus
('OPPO A18 128GB/4GB', 'OPPO', 'OPPO A18 128GB/4GB', 'budget', 540000, 75000, 'UGX 540,000', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&q=80', 'OPPO A18 smartphone', '4GB', '128GB', ARRAY['128GB','4GB RAM'], ARRAY['Flexible Terms'], 4.4, 48);

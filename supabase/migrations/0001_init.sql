-- Coach: esquema inicial (un solo usuario, RLS por user_id)

-- =========================================================
-- Candado de un solo usuario: solo este correo puede existir
-- en auth.users. Cualquier otro registro se rechaza.
-- =========================================================
create or replace function public.enforce_owner_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) <> 'ulisescerda41@gmail.com' then
    raise exception 'Registro no permitido: esta app es de un solo usuario';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_owner_email_trigger on auth.users;
create trigger enforce_owner_email_trigger
  before insert on auth.users
  for each row execute function public.enforce_owner_email();

-- =========================================================
-- profile (una fila por usuario)
-- =========================================================
create table public.profile (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  edad int check (edad between 14 and 100),
  sexo text check (sexo in ('masculino', 'femenino')),
  estatura_cm numeric check (estatura_cm between 100 and 250),
  peso_inicial_kg numeric check (peso_inicial_kg between 30 and 300),
  objetivo text check (objetivo in ('masa', 'grasa', 'resistencia')),
  meta_medible text,
  fecha_meta date,
  experiencia text check (experiencia in ('principiante', 'intermedio', 'avanzado')),
  dias_por_semana int check (dias_por_semana between 1 and 7),
  minutos_por_sesion int check (minutos_por_sesion between 15 and 240),
  lugar_entrenamiento text,
  equipo text,
  lesiones text,
  alimentos_habituales text[] not null default '{}',
  alimentos_excluidos text[] not null default '{}',
  veces_que_cocina_por_semana int check (veces_que_cocina_por_semana between 0 and 21),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- nutrition_targets
-- =========================================================
create table public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  calorias int not null,
  proteina_g int not null,
  grasa_g int not null,
  carbohidratos_g int not null,
  formula_usada text not null,
  vigente_desde timestamptz not null default now()
);
create index nutrition_targets_user_idx on public.nutrition_targets (user_id, vigente_desde desc);

-- =========================================================
-- workout_plans
-- =========================================================
create table public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  version int not null,
  division text not null,
  json_plan jsonb not null,
  motivo_del_cambio text,
  vigente_desde timestamptz not null default now(),
  unique (user_id, version)
);
create index workout_plans_user_idx on public.workout_plans (user_id, version desc);

-- =========================================================
-- workout_logs
-- =========================================================
create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  fecha date not null default current_date,
  ejercicio text not null,
  serie int not null check (serie >= 1),
  peso_kg numeric not null check (peso_kg >= 0),
  repeticiones int not null check (repeticiones >= 0),
  rir int check (rir between 0 and 10),
  plan_version int,
  dia text
);
create index workout_logs_user_idx on public.workout_logs (user_id, ejercicio, fecha desc);

-- =========================================================
-- meal_plans
-- =========================================================
create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  version int not null,
  json_menu jsonb not null,
  lista_compras jsonb not null,
  vigente_desde timestamptz not null default now(),
  unique (user_id, version)
);
create index meal_plans_user_idx on public.meal_plans (user_id, version desc);

-- =========================================================
-- weekly_checkins
-- =========================================================
create table public.weekly_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  semana date not null,
  peso_promedio numeric check (peso_promedio between 30 and 300),
  cintura_cm numeric,
  cadera_cm numeric,
  brazo_cm numeric,
  adherencia_dieta_pct int check (adherencia_dieta_pct between 0 and 100),
  energia int check (energia between 1 and 10),
  sueno int check (sueno between 1 and 10),
  hambre int check (hambre between 1 and 10),
  notas text,
  alerta_salud boolean not null default false,
  unique (user_id, semana)
);
create index weekly_checkins_user_idx on public.weekly_checkins (user_id, semana desc);

-- =========================================================
-- adjustments
-- =========================================================
create table public.adjustments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  fecha date not null default current_date,
  tipo text not null check (tipo in ('calorias', 'volumen', 'ejercicio')),
  detalle text not null,
  dato_que_lo_motivo text not null
);
create index adjustments_user_idx on public.adjustments (user_id, fecha desc);

-- =========================================================
-- Row Level Security: cada fila solo es visible y editable
-- por su dueño.
-- =========================================================
alter table public.profile enable row level security;
alter table public.nutrition_targets enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_logs enable row level security;
alter table public.meal_plans enable row level security;
alter table public.weekly_checkins enable row level security;
alter table public.adjustments enable row level security;

create policy "profile_owner_all" on public.profile
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "nutrition_targets_owner_all" on public.nutrition_targets
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "workout_plans_owner_all" on public.workout_plans
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "workout_logs_owner_all" on public.workout_logs
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "meal_plans_owner_all" on public.meal_plans
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "weekly_checkins_owner_all" on public.weekly_checkins
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "adjustments_owner_all" on public.adjustments
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

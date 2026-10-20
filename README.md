# Coach

App web personal que arma rutinas y menús ajustados a tu progreso real.
Next.js (App Router) + TypeScript, Tailwind, shadcn/ui, Supabase y la API de Anthropic.

> Estado: fase (a) base y login. El README completo (instalación local y
> despliegue) se escribe al terminar todas las fases.

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores. Las llaves viven
solo en variables de entorno, nunca en el código.

## Base de datos

El esquema está en `supabase/migrations/0001_init.sql`. Se ejecuta una vez en
el SQL Editor de Supabase.

## Comandos

```bash
npm install
npm run dev        # servidor local en http://localhost:3000
npm run typecheck  # revisión de tipos
npm test           # pruebas unitarias
npm run build      # build de producción
```

# Frontend

Frontend recomendado: Next.js (React). Este directorio contendrá la app cliente.

Comandos sugeridos:

```bash
cd frontend
npm install
npx next dev
```

Nota: Si no configuras `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, la app arrancará en modo "mock" usando `localStorage` para crear/mostrar reservas (útil para pruebas locales sin Supabase).

Variables de entorno esperadas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

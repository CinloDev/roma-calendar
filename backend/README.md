# Backend

Directorios posibles:
- `functions/` - Edge Functions o serverless
- `api/` - endpoints si se usa Node/Express

Ejecutar (Node):

```bash
cd backend
npm install
npm run dev
```

Variables de entorno esperadas:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (si necesitas operaciones admin)

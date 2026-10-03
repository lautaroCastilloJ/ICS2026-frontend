# ICS2026 – Frontend (React + Vite)

SPA en React 19, Vite 7, Tailwind CSS 4, React Router, React Hook Form y Axios.

## 🧰 Requisitos

| Herramienta | Versión |
|---|---|
| Node.js | 20 LTS o superior (`node -v`) |
| npm | 10+ (`npm -v`) |
| Backend | Corriendo en http://localhost:5142 (ver README del backend) |

## 🚀 Puesta en marcha

### 1. Instalar dependencias

```bash
cd ICS2026-frontend
npm install
```

### 2. Configurar la URL del backend

El archivo `.env.development` ya trae este valor por defecto:

```env
VITE_BACKEND_URL=http://localhost:5142/
```

Si tu backend corre en otro puerto (por ejemplo, con el perfil `https` en `https://localhost:7138`),
**no modifiques `.env.development`**. Creá un `.env.development.local`, que no se sube al repositorio:

```env
VITE_BACKEND_URL=https://localhost:7138/
```

> El front hace las llamadas a `/api/...` y el **proxy de Vite** las reenvía a `VITE_BACKEND_URL`.
> Por eso no hace falta tocar URLs en el código.

### 3. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abrí http://localhost:5173.

> ⚠️ Usá el puerto **5173**. Es el único origen habilitado en la política CORS del backend.
> Si Vite cambia de puerto porque el 5173 está ocupado, cerrá el proceso que lo esté usando.

## 📜 Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Ejecuta ESLint |

## ✅ Orden para levantar todo

1. SQL Server / LocalDB disponible
2. Backend: `dotnet run --project Dsw2025Tpi.Api --launch-profile http`
3. Frontend: `npm run dev`
4. Ingresá con el usuario configurado en `SeedAdmin`

## 🩺 Problemas comunes

| Síntoma | Solución |
|---|---|
| `ECONNREFUSED` en la consola de Vite | El backend no está corriendo o `VITE_BACKEND_URL` apunta a otro puerto |
| Error de CORS en el navegador | El front no está en `localhost:5173` |
| Cambié el `.env` y no toma el valor | Reiniciá `npm run dev` (Vite lee los `.env` solo al arrancar) |
| Errores raros después de un `git pull` | Borrá `node_modules` y ejecutá `npm install` |

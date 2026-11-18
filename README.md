# SmartHaul

SmartHaul is a shared-freight marketplace for the Indian transport industry. It connects senders, truck owners, company administrators, drivers, and platform administrators.

## Project structure

```text
apps/web/   React + Vite frontend
server/     Node.js + Express + MongoDB backend
DESIGN.md   SmartHaul design system
```

## Local development

Frontend:

```powershell
cd apps/web
npm install
npm run dev
```

Backend:

```powershell
cd server
npm install
npm run dev
```

Copy the example environment files and replace their placeholder values:

```text
server/.env.example
apps/web/.env.example
```

## Validation

```powershell
cd apps/web
npm run lint
npm run build

cd ../../server
npm test
```

## Vercel deployment

Deploy the frontend and backend as two separate Vercel projects.

### Frontend project

- Root directory: `apps/web`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:

```text
API_URL=https://your-backend-domain.vercel.app
```

The frontend [Vercel configuration](/C:/Users/MANAS/Desktop/SmartHaul/apps/web/vercel.json) rewrites React Router paths to `index.html`.

### Backend project

- Root directory: `server`
- Framework preset: `Other`
- Environment variables:

```text
MONGODB_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
NODE_ENV=production
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
```

The backend [Vercel configuration](/C:/Users/MANAS/Desktop/SmartHaul/server/vercel.json) sends API requests to [server/api/index.js](/C:/Users/MANAS/Desktop/SmartHaul/server/api/index.js).

After deployment:

1. Copy the backend Vercel domain.
2. Set `API_URL=https://backend-domain.vercel.app` in the frontend project.
3. Set `CLIENT_ORIGIN=https://frontend-domain.vercel.app` in the backend project.
4. Redeploy both projects.
5. Open `https://backend-domain.vercel.app/api/health` to verify the API.

Set `CLIENT_ORIGIN` in the backend project to the exact frontend production and preview origins. For the current SmartHaul frontend project, preview origins matching `https://smart-haul2-*.vercel.app` are also accepted.

Use comma-separated values in `CLIENT_ORIGIN` if the frontend has preview and production domains.

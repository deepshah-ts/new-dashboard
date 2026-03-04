---
description: Setup TiffinStash Admin Portal monorepo
---

# Workflow: Setup TiffinStash Admin Portal

This workflow will create a full‑stack monorepo containing:
- **frontend/** – React + TypeScript + Vite, TailwindCSS, shadcn/ui, React Router, React Query, React Hook Form, Zod.
- **backend/** – Node.js + Express + TypeScript, Prisma ORM with SQLite, seed scripts.
- Shared configuration, scripts and a README.

The steps are designed to be run on a macOS machine with Node.js (>=18) installed.

## Steps

1. **Create project directory** (already at the workspace root).
2. **Initialize a Vite React‑TS app**
   ```bash
   npx -y create-vite@latest ./frontend --template react-ts
   ```
3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
   npx tailwindcss init -p
   npm install @radix-ui/react-icons class-variance-authority clsx lucide-react
   npm install @shadcn/ui
   # Install other UI libs as needed (react-router-dom, @tanstack/react-query, react-hook-form, zod)
   npm install react-router-dom @tanstack/react-query react-hook-form zod
   ```
4. **Configure Tailwind** – replace `tailwind.config.cjs` with the design tokens (primary orange `#DE5200`, etc.) and enable JIT mode.
5. **Add shadcn/ui components** – run the shadcn CLI to generate base components (Button, Card, Dialog, Drawer, etc.)
   ```bash
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button card dialog drawer table tooltip
   ```
6. **Create backend folder**
   ```bash
   mkdir backend && cd backend
   npm init -y
   npm install express cors dotenv
   npm install -D typescript ts-node-dev @types/express @types/node
   npx tsc --init
   ```
7. **Add Prisma**
   ```bash
   npm install prisma @prisma/client
   npx prisma init --datasource-provider sqlite
   ```
   - Edit `prisma/schema.prisma` to include all tables listed in the spec.
   - Run migrations: `npx prisma migrate dev --name init`.
8. **Create seed script**
   ```bash
   mkdir -p prisma/seed && touch prisma/seed/seed.ts
   ```
   - Populate with mock data for every module.
9. **Add scripts to package.json (root)**
   ```json
   "scripts": {
     "dev": "concurrently \"npm --prefix frontend run dev\" \"npm --prefix backend run dev\"",
     "install-all": "npm install && npm --prefix frontend install && npm --prefix backend install",
     "db:seed": "npm --prefix backend run seed",
     "build": "npm --prefix frontend run build && npm --prefix backend run build"
   }
   ```
10. **Create .env.example** at the root with placeholders for DB URL, JWT secret, etc.
11. **Write README** with steps to run:
    ```bash
    npm run install-all
    npm run db:seed
    npm run dev
    ```
12. **Commit initial structure** (optional).

// turbo-all
```

The `// turbo-all` annotation tells the system to automatically run every `run_command` step in this workflow.

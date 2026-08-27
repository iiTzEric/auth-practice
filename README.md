# Auth Practice

A secure API built with Next.js and Supabase Auth. *(This README will grow as you complete each stage — Stage 6 asks for a full write-up.)*

## Stage 0 setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and fill in your real values from Supabase (**Project Settings → API**):
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_KEY=your_anon_key
   PORT=3000
   ```
3. **Run the server**
   ```bash
   npm run dev
   ```
   You should see:
   ```
   Server running and connected to Supabase (http://localhost:3000)
   ```
   If instead you see a connection error, double check your `SUPABASE_URL` and `SUPABASE_KEY`.

## Project structure so far

```
auth-practice/
├── server.js              # custom server: boots Next.js + verifies Supabase connection
├── lib/
│   └── supabaseClient.js  # Supabase client, reads env vars
├── pages/
│   ├── index.js           # placeholder home page
│   └── api/                # (Stage 1+) auth & protected routes go here
├── .env.example
└── .gitignore              # .env is excluded — never commit real keys
```

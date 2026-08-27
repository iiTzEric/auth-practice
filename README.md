# Auth Practice

A secure REST API built with **Next.js** and **Supabase Auth**. It handles user signup, login, and logout, issues and verifies JSON Web Tokens (JWTs), and protects specific routes so that only authenticated users can access them. Interactive API documentation is available via Swagger UI, with full support for testing protected routes using a bearer token.

## What this project does

- Lets a client **sign up** and **log in** with an email and password via Supabase Auth.
- Issues a JWT **access token** on login, which the client attaches to future requests.
- **Verifies** that token on the server before allowing access to protected routes.
- Exposes one **public** route (no auth) and several **protected** routes (auth required), guarded by a single reusable middleware function.
- Supports **logout**, invalidating the current session.
- Documents every route in **Swagger UI** at `/docs`, including a working "Authorize" flow for testing protected endpoints directly from the browser.

## Setup

### 1. Clone and install

```bash
git clone https://github.com/iiTzEric/auth-practice.git
cd auth-practice
npm install
```

### 2. Create a Supabase project

1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. In your project dashboard, go to **Project Settings → API**.
3. Copy your **Project URL** and **anon public key**.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your real values:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_anon_key
PORT=3000
```

**Never commit your real `.env` file.** It's already listed in `.gitignore`.

> **Note on email confirmation:** by default, Supabase requires users to confirm their email before they can log in. For local testing, you can disable this under **Authentication → Providers → Email → Confirm email** in your Supabase dashboard, or confirm test accounts via the confirmation email Supabase sends.

### 4. Run the server

```bash
npm run dev
```

You should see:
```
Server running and connected to Supabase (http://localhost:3000)
```

## API Reference

| Method | Endpoint                  | Auth required | Description                                  |
|--------|----------------------------|:--------------:|-----------------------------------------------|
| POST   | `/api/auth/signup`         | No             | Create a new user account                     |
| POST   | `/api/auth/login`          | No             | Authenticate and receive a JWT access token   |
| POST   | `/api/auth/logout`         | **Yes**        | Terminate the current session                 |
| GET    | `/api/public/info`         | No             | Read public, unprotected data                 |
| GET    | `/api/protected/profile`   | **Yes**        | Read the authenticated user's profile         |
| GET    | `/api/protected/dashboard` | **Yes**        | Example second protected route                |

**Authenticated requests** must include the access token in the request header:
```
Authorization: Bearer <your_access_token>
```

### Status codes

| Code | Meaning                                            |
|------|-----------------------------------------------------|
| 200  | Successful read / login                             |
| 201  | User created (signup)                               |
| 204  | Successful logout (no content)                      |
| 400  | Missing required fields, or a Supabase-side error   |
| 401  | Missing, malformed, invalid, or expired token; or bad login credentials |

## Interactive docs (Swagger UI)

Once the server is running, open:

```
http://localhost:3000/docs
```

Protected routes are marked with a 🔒 lock icon. To test them:
1. Log in via `POST /api/auth/login` (either through Swagger's "Try it out" or `curl`) and copy the returned `access_token`.
2. Click **Authorize** at the top of the Swagger page, paste the token, and confirm.
3. Expand any protected route, click **Try it out** → **Execute**.

![Swagger UI screenshot](./docs-screenshot.png)

*(Screenshot: routes list with lock icons on protected endpoints, and a successful `200` response on `/api/protected/profile` after authorizing.)*

## Project structure

```
auth-practice/
├── server.js                    # Express + Next.js custom server, mounts Swagger UI at /docs
├── openapi.json                 # OpenAPI spec — defines routes + bearerAuth security scheme
├── lib/
│   ├── supabaseClient.js        # Supabase client, initialized from env vars
│   └── requireAuth.js           # Reusable middleware: verifies bearer token, attaches req.user
├── pages/
│   ├── index.js                 # Placeholder home page
│   └── api/
│       ├── auth/
│       │   ├── signup.js
│       │   ├── login.js
│       │   └── logout.js        # protected via requireAuth
│       ├── public/
│       │   └── info.js
│       └── protected/
│           ├── profile.js       # protected via requireAuth
│           └── dashboard.js     # protected via requireAuth
├── .env.example
└── .gitignore                   # excludes .env — real keys are never committed
```

## Notes & known limitations

- **Logout scope:** `POST /api/auth/logout` calls the Supabase SDK's `signOut()` using the anon-key client. This clears the session known to that client instance. Fully revoking one specific token from the server regardless of caller would require Supabase's admin API (`supabase.auth.admin.signOut(token)`), which needs a service-role key rather than the anon key used here.
- **Email confirmation:** Supabase's default email confirmation requirement can block login for freshly signed-up test accounts until confirmed. See the setup note above.

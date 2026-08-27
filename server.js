require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const next = require('next');
const { supabase } = require('./lib/supabaseClient');
const openapiDocument = require('./openapi.json');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function verifySupabaseConnection() {
  // getSession() doesn't require a logged-in user — it just confirms the
  // Supabase client is configured correctly and can reach the project.
  const { error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
}

app.prepare().then(async () => {
  try {
    await verifySupabaseConnection();
  } catch (err) {
    console.error('Failed to connect to Supabase:', err.message);
    process.exit(1);
  }

  const server = express();

  // Swagger UI lives at /docs, with the "Authorize" padlock wired to
  // whichever routes declare `security: [{ bearerAuth: [] }]` in openapi.json.
  server.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

  // Everything else falls through to Next.js (pages + /api routes).
  server.all('*', (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`Server running and connected to Supabase (http://localhost:${port})`);
  });
});

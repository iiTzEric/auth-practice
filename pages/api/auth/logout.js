const { supabase } = require('../../../lib/supabaseClient');
const requireAuth = require('../../../lib/requireAuth');

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // req.user and req.token are already verified by requireAuth at this point.
  // Note: the anon-key client's signOut() clears the session known to this
  // SDK instance. For fully revoking a specific session/refresh token from
  // the server, Supabase's admin API (service role key) offers
  // `supabase.auth.admin.signOut(token)` — worth mentioning in your README
  // as a security note if you go that route instead.
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(204).end();
}

export default requireAuth(handler);

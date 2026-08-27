const { supabase } = require('./supabaseClient');

/**
 * Higher-order function that wraps a Next.js API route handler with
 * bearer-token verification against Supabase. On success it attaches
 * the verified user to `req.user` and the raw token to `req.token`
 * before calling the wrapped handler.
 *
 * Usage:
 *   async function handler(req, res) { ... use req.user ... }
 *   export default requireAuth(handler);
 */
function requireAuth(handler) {
  return async function (req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = data.user;
    req.token = token;

    return handler(req, res);
  };
}

module.exports = requireAuth;

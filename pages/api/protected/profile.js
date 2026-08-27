export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const authHeader = req.headers.authorization;

  // Stage 2: only check that a bearer token is present and well-formed.
  // Stage 3 will add real verification against Supabase.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // TODO (Stage 3): verify `token` with supabase.auth.getUser(token)
  return res.status(200).json({ message: 'Token present — verification comes in Stage 3.' });
}

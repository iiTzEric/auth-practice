const requireAuth = require('../../../lib/requireAuth');

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  return res.status(200).json({
    message: `Welcome back, ${req.user.email}. This is your dashboard.`,
  });
}

export default requireAuth(handler);

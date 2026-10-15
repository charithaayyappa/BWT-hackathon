const jwt = require('jsonwebtoken');
const db = require('./db');

// Authentication: who are you? (reads the JWT from an httpOnly cookie)
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Please log in to continue.' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(id);
    if (!user) return res.status(401).json({ error: 'Account no longer exists.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}

// Authorization: are you allowed? (role check)
const requireRole = (role) => (req, res, next) =>
  req.user.role === role ? next() : res.status(403).json({ error: `Only ${role}s can do this.` });

module.exports = { requireAuth, requireRole };

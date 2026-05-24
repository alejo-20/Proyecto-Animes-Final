const { supabaseAnon } = require('../supabase');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: { user }, error } = await supabaseAnon.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.user = user;
  req.token = token;
  next();
}

module.exports = requireAuth;

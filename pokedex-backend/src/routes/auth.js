const { Router } = require('express');
const { supabaseAdmin, supabaseAnon } = require('../supabase');

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: name || '' },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { data: sessionData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return res.status(400).json({ error: signInError.message });
  }

  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    user: sessionData.user,
    session: sessionData.session,
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.json({
    message: 'Inicio de sesión exitoso',
    user: data.user,
    session: data.session,
  });
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  res.json({ user });
});

module.exports = router;

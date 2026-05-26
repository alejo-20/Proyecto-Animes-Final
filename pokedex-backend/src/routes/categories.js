const { Router } = require('express');
const { supabaseAdmin } = require('../supabase');
const requireAuth = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at');

  if (error) return res.status(500).json({ error: error.message });
  const result = (data || []).map(c => ({ ...c, slug: c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
  res.json(result);
});

router.post('/', requireAuth, async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name,
      description: description || '',
      user_id: req.user.id,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ...data, slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') });
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json({ ...data, slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Categoría eliminada exitosamente' });
});

module.exports = router;

const { Router } = require('express');
const { supabaseAdmin } = require('../supabase');
const requireAuth = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const { category } = req.query;

  let query = supabaseAdmin
    .from('characters')
    .select('*, categories!inner(name)')
    .eq('categories.user_id', req.user.id);

  if (category) {
    query = query.or(`categories.name.ilike.%${category.replace(/-/g, ' ')}%,categories.name.ilike.%${category}%`);
  }

  const { data, error } = await query.order('created_at');

  if (error) return res.status(500).json({ error: error.message });
  const result = (data || []).map(c => ({
    ...c,
    description: c.description || '',
    abilities: c.abilities || '',
    images: c.images || [],
    categories: c.categories ? { ...c.categories, slug: c.categories.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : c.categories,
  }));
  res.json(result);
});

router.post('/', requireAuth, async (req, res) => {
  const { name, description, abilities, category_id, images } = req.body;

  if (!name || !category_id) {
    return res.status(400).json({ error: 'Nombre y category_id son requeridos' });
  }

  const { data: cat } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('id', category_id)
    .eq('user_id', req.user.id)
    .single();

  if (!cat) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  const { data, error } = await supabaseAdmin
    .from('characters')
    .insert({
      name,
      category_id,
      user_id: req.user.id,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ...data, description: description || '', abilities: abilities || '', images: images || [] });
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, description, abilities, images } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;

  const { data, error } = await supabaseAdmin
    .from('characters')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Personaje no encontrado' });
  res.json({ ...data, description: req.body.description || data.description || '', abilities: req.body.abilities || data.abilities || '', images: req.body.images || data.images || [] });
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from('characters')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Personaje eliminado exitosamente' });
});

module.exports = router;

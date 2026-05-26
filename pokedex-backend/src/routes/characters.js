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
    const searchTerm = category.replace(/-/g, ' ').toLowerCase();
    query = query.textSearch('categories.name', searchTerm, { type: 'plain' });
  }

  const { data, error } = await query.order('created_at');

  if (error) return res.status(500).json({ error: error.message });
  let result = (data || []).map(c => ({
    ...c,
    categories: c.categories ? { ...c.categories, slug: c.categories.slug || c.categories.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : c.categories,
  }));

  if (category) {
    const searchTerm = category.replace(/-/g, ' ').toLowerCase();
    result = result.filter(c => c.categories && c.categories.name.toLowerCase().includes(searchTerm));
  }

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
      description: description || '',
      abilities: abilities || '',
      category_id,
      user_id: req.user.id,
      images: images || [],
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, description, abilities, images } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (abilities !== undefined) updates.abilities = abilities;
  if (images !== undefined) updates.images = images;

  const { data, error } = await supabaseAdmin
    .from('characters')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Personaje no encontrado' });
  res.json(data);
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

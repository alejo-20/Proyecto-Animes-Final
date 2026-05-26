import { supabase } from './supabase';

const BACKEND_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://proyecto-animes-final-production.up.railway.app';

async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function getCategories(): Promise<any[]> {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_URL}/categories`, { headers });
  if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Error del servidor' })); throw new Error(err.error || err.message || 'Error al obtener categorías'); }
  return res.json();
}

export async function createCategory(name: string, description?: string, emoji?: string): Promise<any> {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_URL}/categories`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, description, emoji }),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Error del servidor' })); throw new Error(err.error || err.message || 'Error al crear categoría'); }
  return res.json();
}

export async function updateCategory(id: number | string, name: string, description?: string, emoji?: string): Promise<any> {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_URL}/categories/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ name, description, emoji }),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Error del servidor' })); throw new Error(err.error || err.message || 'Error al actualizar categoría'); }
  return res.json();
}

export async function deleteCategory(id: number | string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_URL}/categories/${id}`, { method: 'DELETE', headers });
  if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Error del servidor' })); throw new Error(err.error || err.message || 'Error al eliminar categoría'); }
}

export async function getCharacters(category?: string): Promise<any[]> {
  const headers = await authHeaders();
  const url = category ? `${BACKEND_URL}/characters?category=${category}` : `${BACKEND_URL}/characters`;
  const res = await fetch(url, { headers });
  if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Error del servidor' })); throw new Error(err.error || err.message || 'Error al obtener personajes'); }
  return res.json();
}

export async function createCharacter(data: {
  name: string;
  description?: string;
  abilities?: string;
  category_id: number;
  images?: string[];
}): Promise<any> {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_URL}/characters`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Error del servidor' })); throw new Error(err.error || err.message || 'Error al crear personaje'); }
  return res.json();
}

export async function updateCharacter(id: number | string, data: {
  name?: string;
  description?: string;
  abilities?: string;
  images?: string[];
}): Promise<any> {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_URL}/characters/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Error del servidor' })); throw new Error(err.error || err.message || 'Error al actualizar personaje'); }
  return res.json();
}

export async function deleteCharacter(id: number | string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_URL}/characters/${id}`, { method: 'DELETE', headers });
  if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Error del servidor' })); throw new Error(err.error || err.message || 'Error al eliminar personaje'); }
}

export async function getCharacterWithImages(category: string, name: string): Promise<any> {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_URL}/characters?category=${category}`, { headers });
  if (!res.ok) { const err = await res.json().catch(() => ({ message: 'Error del servidor' })); throw new Error(err.error || err.message || 'Error al buscar personaje'); }
  const chars = await res.json();
  return chars.find((c: any) => c.name.toLowerCase() === name.toLowerCase()) || null;
}

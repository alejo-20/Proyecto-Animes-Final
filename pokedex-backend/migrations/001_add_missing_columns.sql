-- Migration: add missing columns to categories and characters tables
-- Paste and run this in your Supabase SQL Editor (Dashboard → SQL Editor)

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS slug TEXT;

ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS abilities TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

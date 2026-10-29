-- Keep the product ID sequence ahead of rows inserted with explicit IDs by the seed.
SELECT setval(
  pg_get_serial_sequence('public.productos', 'id'),
  COALESCE((SELECT MAX(id) FROM public.productos), 1),
  EXISTS (SELECT 1 FROM public.productos)
);

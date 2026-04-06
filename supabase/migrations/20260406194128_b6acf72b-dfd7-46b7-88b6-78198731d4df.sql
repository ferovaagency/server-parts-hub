CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT,
  stock INTEGER DEFAULT 0,
  images TEXT[],
  category_id UUID REFERENCES public.categories(id),
  brand_id UUID REFERENCES public.brands(id),
  specs JSONB,
  meta_title TEXT,
  meta_description TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  sale_available BOOLEAN DEFAULT true,
  rental_available BOOLEAN DEFAULT false,
  rental_min_months INTEGER DEFAULT 3,
  compatible_products UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_company TEXT,
  items JSONB NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_products" ON public.products FOR SELECT USING (true);
CREATE POLICY "public_read_categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "public_read_brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "public_insert_quotes" ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_quotes" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "public_update_quotes" ON public.quotes FOR UPDATE USING (true);
CREATE POLICY "public_insert_customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "public_update_customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "public_insert_products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "public_delete_products" ON public.products FOR DELETE USING (true);
CREATE POLICY "public_insert_categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "public_insert_brands" ON public.brands FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_brands" ON public.brands FOR UPDATE USING (true);
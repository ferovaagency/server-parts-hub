import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const mapRow = (row: any) => ({
  id: row.id, slug: row.slug, name: row.name,
  description: row.description ?? "",
  shortDesc: row.short_description ?? "",
  sku: row.sku ?? "", stock: row.stock ?? 0,
  images: row.images ?? [],
  categoryId: row.category_id ?? "",
  brandId: row.brand_id ?? "",
  specs: row.specs ?? {},
  metaTitle: row.meta_title ?? "",
  metaDesc: row.meta_description ?? "",
  active: row.active ?? true,
  featured: row.featured ?? false,
  saleAvailable: row.sale_available ?? true,
  rentalAvailable: row.rental_available ?? false,
  rentalMinMonths: row.rental_min_months ?? 3,
  compatibleProducts: row.compatible_products ?? [],
});

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("products")
      .select("*").eq("active", true)
      .order("created_at", { ascending: false });
    setProducts((data ?? []).map(mapRow));
    setLoading(false);
  }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return { products, loading, refetch: fetchProducts };
}

export async function fetchAllProducts() {
  const { data } = await supabase.from("products").select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapRow);
}

export async function fetchProductBySlug(slug: string) {
  const { data } = await supabase.from("products")
    .select("*").eq("slug", slug).maybeSingle();
  return data ? mapRow(data) : null;
}

export async function fetchCompatibleProducts(ids: string[]) {
  if (!ids?.length) return [];
  const { data } = await supabase.from("products")
    .select("*").in("id", ids).eq("active", true);
  return (data ?? []).map(mapRow);
}

export async function upsertProductDB(product: any) {
  const row = {
    slug: product.slug, name: product.name,
    description: product.description,
    short_description: product.shortDesc,
    sku: product.sku, stock: product.stock,
    images: product.images,
    category_id: product.categoryId,
    brand_id: product.brandId,
    specs: product.specs,
    meta_title: product.metaTitle,
    meta_description: product.metaDesc,
    active: product.active, featured: product.featured,
    sale_available: product.saleAvailable,
    rental_available: product.rentalAvailable,
    rental_min_months: product.rentalMinMonths,
    compatible_products: product.compatibleProducts,
  };
  const { data: existing } = await supabase.from("products")
    .select("id").eq("slug", product.slug).maybeSingle();
  if (existing?.id) {
    const { data } = await supabase.from("products")
      .update(row).eq("id", existing.id).select().single();
    return { product: mapRow(data), updated: true };
  }
  const { data } = await supabase.from("products")
    .insert(row).select().single();
  return { product: mapRow(data), updated: false };
}

export async function deleteProductDB(id: string) {
  await supabase.from("products").delete().eq("id", id);
}

export async function setProductActiveDB(id: string, active: boolean) {
  await supabase.from("products").update({ active }).eq("id", id);
}

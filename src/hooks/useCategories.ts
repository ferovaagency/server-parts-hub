import { supabase } from "@/lib/supabase";
import { useState, useEffect, useCallback } from "react";

const mapCat = (r: any) => ({ id: r.id, slug: r.slug, name: r.name, description: r.description ?? "", image: r.image ?? "" });
const mapBrand = (r: any) => ({ id: r.id, slug: r.slug, name: r.name, logo: r.logo ?? "" });

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories((data ?? []).map(mapCat));
    setLoading(false);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { categories, loading };
}

export function useBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("brands").select("*").order("name");
    setBrands((data ?? []).map(mapBrand));
    setLoading(false);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { brands, loading };
}

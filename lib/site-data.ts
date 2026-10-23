// Base URL Backend PHP Localhost Laragon
const API_BASE_URL =
  "https://f9de-103-83-179-182.ngrok-free.app/idvision/backend/api";
const FETCH_HEADERS = {
  Accept: "application/json",
};

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta_label: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
}

/**
 * Mengambil Informasi Toko & Footer
 */
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    return {
      site_name: "IDVISION",
      address: "Jl. Pahlawan No. 15, Magelang, Jawa Tengah 56111",
      phone: "0858-7766-9323",
      email: "support@idvision.com",
    };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {};
  }
}

/**
 * Mengambil Banner Carousel dari API PHP
 */
export async function getBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/banners/index.php`, {
      cache: "no-store",
      headers: FETCH_HEADERS,
    });
    if (!res.ok) return [];

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

/**
 * Mengambil Katalog Produk dari API PHP
 */
export async function getProducts(params?: {
  category?: string;
  gender?: string;
  search?: string;
  sort?: string;
  material_id?: string;
  shape_id?: string;
  page?: number;
}) {
  try {
    const queryParams = new URLSearchParams();

    // Mengambil parameter category/gender langsung sesuai slug database (pria, wanita, unisex, kids)
    const categoryParam = params?.category || params?.gender;
    if (categoryParam) {
      queryParams.append("category", categoryParam.toLowerCase().trim());
    }

    // Mengirim parameter sorting ke backend
    if (params?.sort) {
      queryParams.append("sort", params.sort);
    }

    const url = `${API_BASE_URL}/products/index.php?${queryParams.toString()}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: FETCH_HEADERS,
    });

    if (!res.ok) return { data: [] };

    const result = await res.json();
    const rawData = result.data || [];

    // Transformasi data API PHP ke format yang dibaca oleh ProductCard & ProductsContent
    let mappedData = rawData.map((item: any) => ({
      id: item.product_id,
      product_id: item.product_id,
      name: item.name,
      slug: item.slug,
      sku: item.sku_base,
      description: item.description,
      price: Number(item.base_price || 0),
      base_price: Number(item.base_price || 0),
      discount_percent: Number(item.discount_percent || 0),
      discount_price: item.discount_price ? Number(item.discount_price) : null,
      gender: item.category_name || "Unisex",
      category_name: item.category_name || "Unisex",
      category_slug: item.category_slug || "",
      image:
        item.image_url ||
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
      image_url:
        item.image_url ||
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
      stock: Number(item.total_stock || 0),
      is_featured: Boolean(item.is_featured),
    }));

    // Filter jika ada parameter pencarian
    if (params?.search && Array.isArray(mappedData)) {
      let q = params.search.toLowerCase().trim();

      if (q === "anak" || q === "anak-anak") q = "kids";

      mappedData = mappedData.filter((p: any) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const skuMatch = p.sku ? p.sku.toLowerCase().includes(q) : false;
        const categoryMatch = p.category_name.toLowerCase().includes(q);
        const categorySlugMatch = p.category_slug.toLowerCase().includes(q);
        const genderMatch = p.gender.toLowerCase().includes(q);

        return (
          nameMatch ||
          skuMatch ||
          categoryMatch ||
          categorySlugMatch ||
          genderMatch
        );
      });
    }

    return { data: mappedData };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [] };
  }
}

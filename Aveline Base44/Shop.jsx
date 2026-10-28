import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useProductList } from "@/hooks/useProducts";
import { CATEGORIES, ALL_SIZES, ALL_COLORS } from "@/data/products";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    if (params.get("filter") === "new") setSort("newest");
  }, []);

  const query = useMemo(() => {
    const q = { published: true };
    if (category) q.category = category;
    if (size) q.sizes = { $in: [size] };
    if (color) q.colors = { $in: [color] };
    const price = {};
    if (minPrice) price.$gte = Number(minPrice);
    if (maxPrice) price.$lte = Number(maxPrice);
    if (Object.keys(price).length) q.price = price;
    if (inStock) q.inventory = { $gt: 0 };
    return q;
  }, [category, size, color, minPrice, maxPrice, inStock, sort]);

  const options = useMemo(() => {
    const opt = { limit: 60 };
    if (sort === "newest") opt.sort = "-created_date";
    else if (sort === "price-asc") opt.sort = "price";
    else if (sort === "price-desc") opt.sort = "-price";
    else opt.sort = "-created_date";
    return opt;
  }, [sort]);

  const { items, loading } = useProductList(query, options);

  const clearAll = () => {
    setCategory(""); setSize(""); setColor(""); setMinPrice(""); setMaxPrice(""); setInStock(false); setSort("featured");
    setParams({});
  };

  const activeCount = [category, size, color, minPrice, maxPrice, inStock].filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-7">
      <FilterGroup label="Category">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </FilterGroup>
      <FilterGroup label="Size">
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((s) => (
            <button key={s} onClick={() => setSize(size === s ? "" : s)} className={`px-3 py-2 text-xs border transition-colors ${size === s ? "bg-deep-black text-ivory border-deep-black" : "border-border hover:border-foreground"}`}>{s}</button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label="Colour">
        <div className="flex flex-wrap gap-1.5">
          {ALL_COLORS.map((c) => (
            <button key={c} onClick={() => setColor(color === c ? "" : c)} className={`px-3 py-2 text-xs border transition-colors ${color === c ? "bg-deep-black text-ivory border-deep-black" : "border-border hover:border-foreground"}`}>{c}</button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label="Price Range (₹)">
        <div className="flex items-center gap-2">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground" />
          <span className="text-muted-foreground">—</span>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground" />
        </div>
      </FilterGroup>
      <FilterGroup label="Availability">
        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-deep-black" />
          In stock only
        </label>
      </FilterGroup>
    </div>
  );

  return (
    <div className="pt-24 md:pt-28">
      <div className="px-5 md:px-8 py-10 md:py-16 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Shop</p>
        <h1 className="display text-4xl md:text-6xl">All Products</h1>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 md:px-8 pb-24">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Desktop filters */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="flex items-center justify-between mb-6">
              <p className="eyebrow">Filters</p>
              {activeCount > 0 && <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">Clear</button>}
            </div>
            <FilterPanel />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <button onClick={() => setMobileFilters(true)} className="md:hidden inline-flex items-center gap-2 eyebrow">
                <SlidersHorizontal size={15} /> Filters {activeCount > 0 && `(${activeCount})`}
              </button>
              <p className="text-sm text-muted-foreground hidden md:block">{loading ? "Loading…" : `${items.length} ${items.length === 1 ? "piece" : "pieces"}`}</p>
              <div className="flex items-center gap-2">
                <span className="eyebrow text-muted-foreground hidden sm:inline">Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-sm border-b border-border py-1 focus:outline-none focus:border-foreground">
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-soft-grey animate-pulse" />)}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-24">
                <p className="display text-3xl mb-4">No pieces found</p>
                <p className="text-muted-foreground mb-8">Try adjusting your filters to discover more.</p>
                <button onClick={clearAll} className="eyebrow border border-border px-8 py-4 hover:bg-deep-black hover:text-ivory transition-colors">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
                {items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div className="absolute inset-0 bg-deep-black/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-80 max-w-[85%] bg-ivory p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="eyebrow">Filters</p>
              <button onClick={() => setMobileFilters(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <FilterPanel />
            <div className="mt-8 flex gap-3">
              <button onClick={clearAll} className="flex-1 eyebrow border border-border py-3">Clear</button>
              <button onClick={() => setMobileFilters(false)} className="flex-1 eyebrow bg-deep-black text-ivory py-3">Show Results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <p className="eyebrow text-muted-foreground mb-3">{label}</p>
      {children}
    </div>
  );
}
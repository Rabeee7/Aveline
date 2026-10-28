import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useProductList } from "@/hooks/useProducts";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);

  useEffect(() => { setInput(q); }, [q]);

  const query = q
    ? { published: true, $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ] }
    : { published: true };

  const { items, loading } = useProductList(query, { limit: 60 });

  const submit = (e) => {
    e.preventDefault();
    setParams(input.trim() ? { q: input.trim() } : {});
  };

  return (
    <div className="pt-24 md:pt-28">
      <section className="px-5 md:px-8 py-12 md:py-16 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Search</p>
        <h1 className="display text-4xl md:text-6xl mb-8">Search the Collection</h1>
        <form onSubmit={submit} className="max-w-xl mx-auto flex items-center gap-3 border-b border-border pb-3">
          <SearchIcon size={18} className="text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search products, categories, collections…"
            className="flex-1 bg-transparent outline-none text-lg"
            aria-label="Search"
          />
          {input && <button type="button" onClick={() => { setInput(""); setParams({}); }} aria-label="Clear"><X size={16} /></button>}
        </form>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 md:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-soft-grey animate-pulse" />)}
          </div>
        ) : !q ? (
          <p className="text-center text-muted-foreground py-20">Start typing to explore the collection.</p>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="display text-3xl mb-4">No results for “{q}”</p>
            <p className="text-muted-foreground mb-8">Try a different term or explore the shop.</p>
            <Link to="/shop" className="eyebrow border border-border px-8 py-4 inline-block hover:bg-deep-black hover:text-ivory transition-colors">Browse All</Link>
          </div>
        ) : (
          <>
            <p className="eyebrow text-muted-foreground mb-8">{items.length} results for “{q}”</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
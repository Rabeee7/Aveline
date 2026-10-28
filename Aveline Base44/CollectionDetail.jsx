import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { ProductCard } from "@/components/ProductCard";
import { useProductList } from "@/hooks/useProducts";
import { COLLECTIONS } from "@/data/products";

export default function CollectionDetail() {
  const { slug } = useParams();
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  const { items, loading } = useProductList({ collections: { $in: [slug] }, published: true }, { limit: 60 });

  if (!collection) {
    return (
      <div className="pt-40 pb-40 text-center px-5">
        <p className="display text-3xl mb-4">Collection not found</p>
        <Link to="/collections" className="eyebrow border border-border px-8 py-4 inline-block">All Collections</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28">
      <section className="relative h-[55vh] min-h-[360px] overflow-hidden bg-deep-black">
        <Image src={collection.image} alt={collection.name} fittingType="fill" className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black/70 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-8 md:p-14 text-ivory">
          <p className="eyebrow text-accent mb-3">Collection</p>
          <h1 className="display text-4xl md:text-7xl">{collection.name}</h1>
          <p className="mt-4 max-w-lg text-ivory/80 text-lg">{collection.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 md:px-8 py-14 md:py-20">
        <div className="flex items-center justify-between mb-10">
          <p className="eyebrow text-muted-foreground">{loading ? "Loading…" : `${items.length} pieces`}</p>
          <Link to="/shop" className="eyebrow text-muted-foreground hover:text-foreground inline-flex items-center gap-2">All Products <ArrowRight size={13} /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-soft-grey animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No pieces in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
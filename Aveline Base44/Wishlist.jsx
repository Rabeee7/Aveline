import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useProductList } from "@/hooks/useProducts";

function WishlistGrid({ ids }) {
  const { items, loading } = useProductList({ id: { $in: ids }, published: true }, { limit: 60 });
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-soft-grey animate-pulse" />)}
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="display text-3xl mb-4">Your wishlist is empty</p>
        <p className="text-muted-foreground mb-8">Save pieces you love to find them again here.</p>
        <Link to="/shop" className="eyebrow border border-border px-8 py-4 inline-block hover:bg-deep-black hover:text-ivory transition-colors">Continue Shopping</Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
      {items.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export default function Wishlist() {
  const { ids } = useWishlist();
  return (
    <div className="pt-24 md:pt-28">
      <section className="px-5 md:px-8 py-12 md:py-16 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Saved</p>
        <h1 className="display text-4xl md:text-6xl">Wishlist</h1>
      </section>
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 pb-24">
        {ids.length === 0 ? (
          <div className="text-center py-20">
            <p className="display text-3xl mb-4">Your wishlist is empty</p>
            <p className="text-muted-foreground mb-8">Save pieces you love to find them again here.</p>
            <Link to="/shop" className="eyebrow border border-border px-8 py-4 inline-block hover:bg-deep-black hover:text-ivory transition-colors">Continue Shopping</Link>
          </div>
        ) : (
          <WishlistGrid ids={ids} />
        )}
      </div>
    </div>
  );
}
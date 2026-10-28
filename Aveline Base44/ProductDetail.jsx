import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronDown, Minus, Plus, Heart } from "lucide-react";
import { Image } from "@/components/ui/image";
import { fetchProductBySlug, useProductList } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatINR } from "@/lib/format";
import { COLLECTIONS } from "@/data/products";

const COLOR_DOT = { Ivory: "#F5F1E9", Black: "#111111", Stone: "#D8CCBB", Charcoal: "#292929" };

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { has, toggle } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProductBySlug(slug).then((p) => {
      if (!active) return;
      setProduct(p);
      setColor(p?.colors?.[0] || "");
      setActiveImg(0);
      setLoading(false);
    });
    return () => { active = false; };
  }, [slug]);

  const related = useProductList(
    product ? { category: product.category, id: { $ne: product.id }, published: true } : {},
    { limit: 4 }
  );

  if (loading) {
    return <div className="pt-32 px-5 md:px-8"><div className="aspect-[3/4] max-w-md bg-soft-grey animate-pulse" /></div>;
  }
  if (!product) {
    return (
      <div className="pt-40 pb-40 text-center px-5">
        <p className="display text-3xl mb-4">Piece not found</p>
        <Link to="/shop" className="eyebrow border border-border px-8 py-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const needsSize = product.sizes.length > 1 && !product.sizes.includes("One Size");

  const handleAdd = (buyNow = false) => {
    if (needsSize && !size) { setError("Please select a size."); return; }
    setError("");
    addItem(product, { size: size || product.sizes[0], color, quantity: qty });
    if (buyNow) navigate("/checkout");
    else openCart();
  };

  const sections = [
    { key: "details", label: "Product Details", body: product.description },
    { key: "materials", label: "Materials", body: product.materials || "Editable placeholder — verify before publishing." },
    { key: "care", label: "Care Instructions", body: product.care || "Editable placeholder — verify before publishing." },
    { key: "size", label: "Size Guide", body: "Measurements are in centimetres. Editable placeholder — replace with verified garment measurements." },
    { key: "shipping", label: "Shipping", body: "Complimentary shipping on orders above ₹5,000. Editable placeholder — confirm rates before publishing." },
    { key: "returns", label: "Returns", body: "Returns accepted within 14 days of delivery. Editable placeholder — confirm policy before publishing." },
  ];

  return (
    <div className="pt-24 md:pt-28">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 py-8">
        <nav className="eyebrow text-muted-foreground mb-8 flex gap-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 md:gap-14">
          {/* Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border ${activeImg === i ? "border-foreground" : "border-transparent"}`}>
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fittingType="fill" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden bg-soft-grey aspect-[3/4]">
              <Image src={product.images[activeImg]} alt={product.name} fittingType="fill" className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="md:sticky md:top-28 md:self-start">
            <p className="eyebrow text-muted-foreground mb-3">{product.category}</p>
            <h1 className="display text-3xl md:text-5xl mb-4">{product.name}</h1>
            <p className="text-2xl tabular-nums mb-6">{formatINR(product.price)}</p>
            <p className="text-foreground/70 leading-relaxed mb-8">{product.description}</p>

            {/* Colour */}
            <div className="mb-6">
              <p className="eyebrow text-muted-foreground mb-3">Colour: <span className="text-foreground">{color}</span></p>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} aria-label={c} className={`h-9 w-9 rounded-full border-2 transition-colors ${color === c ? "border-foreground" : "border-border"}`} style={{ background: COLOR_DOT[c] || "#ccc" }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <p className="eyebrow text-muted-foreground mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`min-w-[3rem] px-4 py-3 text-sm border transition-colors ${size === s ? "bg-deep-black text-ivory border-deep-black" : "border-border hover:border-foreground"}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="eyebrow text-muted-foreground mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="h-11 w-11 grid place-items-center hover:bg-soft-grey"><Minus size={15} /></button>
                <span className="w-12 text-center tabular-nums">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="h-11 w-11 grid place-items-center hover:bg-soft-grey"><Plus size={15} /></button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button onClick={() => handleAdd(false)} className="flex-1 bg-deep-black text-ivory py-4 eyebrow hover:bg-charcoal transition-colors">Add to Bag</button>
              <button onClick={() => handleAdd(true)} className="flex-1 border border-deep-black py-4 eyebrow hover:bg-deep-black hover:text-ivory transition-colors">Buy Now</button>
              <button onClick={() => toggle(product.id)} aria-label="Wishlist" className="h-[52px] w-[52px] border border-border grid place-items-center hover:border-foreground">
                <Heart size={18} className={has(product.id) ? "fill-foreground stroke-foreground" : "stroke-foreground"} />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              {product.inventory > 0 ? "In stock" : "Out of stock"} · {product.inventory} available
            </p>

            {/* Expandable sections */}
            <div className="border-t border-border">
              {sections.map((s) => (
                <div key={s.key} className="border-b border-border">
                  <button onClick={() => setOpenSection(openSection === s.key ? null : s.key)} className="w-full flex items-center justify-between py-4 text-left">
                    <span className="eyebrow">{s.label}</span>
                    <ChevronDown size={16} className={`transition-transform ${openSection === s.key ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === s.key && (
                    <p className="pb-5 text-sm text-foreground/70 leading-relaxed">{s.body}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.items.length > 0 && (
          <div className="mt-24 md:mt-32">
            <h2 className="display text-3xl md:text-5xl mb-10 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {related.items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
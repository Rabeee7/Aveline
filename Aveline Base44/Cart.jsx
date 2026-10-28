import { Link } from "react-router-dom";
import { Plus, Minus, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/format";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, count } = useCart();

  return (
    <div className="pt-24 md:pt-28">
      <section className="px-5 md:px-8 py-12 md:py-16 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Bag</p>
        <h1 className="display text-4xl md:text-6xl">Shopping Bag</h1>
        <p className="mt-3 text-muted-foreground text-sm">{count} {count === 1 ? "item" : "items"}</p>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 md:px-8 pb-24">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="display text-3xl mb-4">Your bag is empty</p>
            <p className="text-muted-foreground mb-8">Discover pieces designed beyond seasons.</p>
            <Link to="/shop" className="eyebrow border border-border px-8 py-4 inline-block hover:bg-deep-black hover:text-ivory transition-colors">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 divide-y divide-border">
              {items.map((item) => (
                <div key={item.key} className="flex gap-5 py-6">
                  <Link to={`/product/${item.slug}`} className="shrink-0">
                    <div className="w-24 h-32 bg-soft-grey overflow-hidden">
                      <Image src={item.image} alt={item.name} fittingType="fill" className="h-full w-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-3">
                      <Link to={`/product/${item.slug}`} className="hover:text-accent"><p className="text-base">{item.name}</p></Link>
                      <p className="tabular-nums">{formatINR(item.price * item.quantity)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.color && <span>{item.color}</span>}
                      {item.color && item.size && <span> · </span>}
                      {item.size && <span>{item.size}</span>}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease" className="h-9 w-9 grid place-items-center hover:bg-soft-grey"><Minus size={13} /></button>
                        <span className="w-9 text-center text-sm tabular-nums">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase" className="h-9 w-9 grid place-items-center hover:bg-soft-grey"><Plus size={13} /></button>
                      </div>
                      <button onClick={() => removeItem(item.key)} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><X size={13} /> Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="md:sticky md:top-28 md:self-start border border-border p-6">
              <p className="eyebrow mb-5">Order Summary</p>
              <div className="flex justify-between py-2 text-sm"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{formatINR(subtotal)}</span></div>
              <div className="flex justify-between py-2 text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-muted-foreground">Calculated at checkout</span></div>
              <div className="flex justify-between py-2 text-sm"><span className="text-muted-foreground">Taxes</span><span className="text-muted-foreground">Calculated at checkout</span></div>
              <div className="flex justify-between py-4 mt-2 border-t border-border text-lg"><span>Subtotal</span><span className="tabular-nums">{formatINR(subtotal)}</span></div>
              <Link to="/checkout" className="block w-full text-center bg-deep-black text-ivory py-4 eyebrow hover:bg-charcoal transition-colors">Checkout</Link>
              <Link to="/shop" className="block w-full text-center eyebrow text-muted-foreground hover:text-foreground py-3 mt-2">Continue Shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
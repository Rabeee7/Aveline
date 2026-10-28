import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/format";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const returnStatus = searchParams.get("status");

  const [form, setForm] = useState({ email: "", customerName: "", address: "", city: "", pincode: "", phone: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Clear cart when returning from successful Stripe checkout
  useEffect(() => {
    if (returnStatus === "success") clearCart();
  }, [returnStatus, clearCart]);

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { setError("Your bag is empty."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Please enter a valid email."); return; }
    if (!form.customerName.trim() || !form.address.trim() || !form.city.trim() || !form.pincode.trim() || !form.phone.trim()) {
      setError("Please complete all shipping fields."); return;
    }
    setError(""); setStatus("loading");
    try {
      const response = await base44.functions.invoke("createCheckoutSession", {
        items,
        email: form.email,
        customerName: form.customerName,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        phone: form.phone,
        subtotal,
      });

      const { url } = response.data;

      const isFramed = window.self !== window.top;
      const checkoutTab = isFramed ? window.open("", "_blank") : null;
      if (isFramed && !checkoutTab) throw new Error("Allow popups to continue to checkout.");
      if (checkoutTab) checkoutTab.opener = null;

      try {
        if (checkoutTab) {
          checkoutTab.location.replace(url);
        } else {
          window.location.assign(url);
        }
      } catch (navErr) {
        checkoutTab?.close();
        throw navErr;
      }
    } catch (err) {
      setStatus("error");
      setError(err?.response?.data?.error || err?.data?.error || err?.message || "Could not start checkout. Please try again.");
    }
  };

  if (returnStatus === "success") {
    return (
      <div className="pt-32 pb-32 px-5 text-center">
        <p className="eyebrow text-accent mb-4">Payment Confirmed</p>
        <h1 className="display text-4xl md:text-6xl mb-6">Thank you</h1>
        <p className="max-w-md mx-auto text-foreground/70 mb-10">
          Your order has been placed and payment received. A confirmation will arrive in your inbox shortly.
        </p>
        <Link to="/shop" className="eyebrow border border-border px-8 py-4 inline-block hover:bg-deep-black hover:text-ivory transition-colors">Continue Shopping</Link>
      </div>
    );
  }

  if (returnStatus === "cancel") {
    return (
      <div className="pt-32 pb-32 px-5 text-center">
        <p className="eyebrow text-muted-foreground mb-4">Checkout Cancelled</p>
        <h1 className="display text-4xl md:text-6xl mb-6">No charge made</h1>
        <p className="max-w-md mx-auto text-foreground/70 mb-10">
          Your payment was cancelled — nothing has been charged. Your bag is still here, ready when you are.
        </p>
        <Link to="/cart" className="eyebrow border border-border px-8 py-4 inline-block hover:bg-deep-black hover:text-ivory transition-colors">Return to Bag</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28">
      <section className="px-5 md:px-8 py-10 md:py-14 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Checkout</p>
        <h1 className="display text-4xl md:text-6xl">Complete Your Order</h1>
      </section>

      <div className="mx-auto max-w-[1100px] px-5 md:px-8 pb-24">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="display text-3xl mb-4">Your bag is empty</p>
            <Link to="/shop" className="eyebrow border border-border px-8 py-4 inline-block">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={submit} className="space-y-5">
              <p className="eyebrow mb-2">Shipping & Contact</p>
              <Input label="Email" value={form.email} onChange={update("email")} type="email" />
              <Input label="Full Name" value={form.customerName} onChange={update("customerName")} />
              <Input label="Address" value={form.address} onChange={update("address")} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={form.city} onChange={update("city")} />
                <Input label="PIN Code" value={form.pincode} onChange={update("pincode")} />
              </div>
              <Input label="Phone" value={form.phone} onChange={update("phone")} />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={status === "loading"} className="w-full bg-deep-black text-ivory py-4 eyebrow hover:bg-charcoal transition-colors disabled:opacity-60">
                {status === "loading" ? "Redirecting to payment…" : "Pay Now"}
              </button>
              <p className="text-xs text-muted-foreground">
                You will be redirected to Stripe's secure checkout to complete payment. No card details are stored on this site.
              </p>
            </form>

            <aside className="border border-border p-6 h-fit">
              <p className="eyebrow mb-5">Order Summary</p>
              <div className="space-y-4 max-h-72 overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-3 text-sm">
                    <span className="flex-1">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                    <span className="tabular-nums">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-5 pt-5 border-t border-border text-lg">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatINR(subtotal)}</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground block mb-2">{label}</span>
      <input type={type} value={value} onChange={onChange} className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground" />
    </label>
  );
}
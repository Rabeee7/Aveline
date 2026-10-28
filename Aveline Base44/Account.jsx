import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { formatINR } from "@/lib/format";

export default function Account() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        const page = await base44.entities.order.filter({}, { sort: "-created_date", limit: 50 });
        setOrders(page.items || []);
      } catch (e) {
        // not logged in
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    await base44.auth.logout();
    navigate("/");
  };

  if (loading) return <div className="pt-32 px-5"><div className="h-8 w-8 border-4 border-beige border-t-deep-black rounded-full animate-spin" /></div>;

  return (
    <div className="pt-24 md:pt-28">
      <section className="px-5 md:px-8 py-12 md:py-16 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Account</p>
        <h1 className="display text-4xl md:text-6xl">{user ? `Welcome, ${user.full_name || user.email}` : "Your Account"}</h1>
      </section>

      <div className="mx-auto max-w-[900px] px-5 md:px-8 pb-24">
        {user && (
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <div className="border border-border p-5">
              <p className="eyebrow text-muted-foreground mb-2">Email</p>
              <p className="text-sm">{user.email}</p>
            </div>
            <div className="border border-border p-5">
              <p className="eyebrow text-muted-foreground mb-2">Role</p>
              <p className="text-sm capitalize">{user.role}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="display text-2xl md:text-3xl">Order History</h2>
          {user?.role === "admin" && <Link to="/admin" className="eyebrow text-accent hover:underline">Admin Panel</Link>}
        </div>

        {orders.length === 0 ? (
          <div className="border border-border p-10 text-center">
            <p className="text-muted-foreground mb-4">No orders yet.</p>
            <Link to="/shop" className="eyebrow border border-border px-6 py-3 inline-block hover:bg-deep-black hover:text-ivory transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="divide-y divide-border border border-border">
            {orders.map((o) => (
              <div key={o.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm tabular-nums">Order …{o.id?.slice(-8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.created_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="eyebrow text-muted-foreground capitalize">{o.status}</span>
                  <span className="tabular-nums">{formatINR(o.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button onClick={logout} className="eyebrow border border-border px-8 py-3 hover:bg-deep-black hover:text-ivory transition-colors">Sign Out</button>
        </div>
      </div>
    </div>
  );
}
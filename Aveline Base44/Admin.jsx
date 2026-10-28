import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { formatINR } from "@/lib/format";
import { CATEGORIES, COLLECTIONS } from "@/data/products";
import { X, Plus, Trash2, Pencil, Upload } from "lucide-react";

const EMPTY = {
  name: "", slug: "", category: "T-Shirts", price: "",
  colors: "Ivory, Black", sizes: "S, M, L, XL",
  images: [], description: "", materials: "", care: "",
  collections: "core", inventory: 0, featured: false, isNew: false, published: true,
};

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product or {} for new
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const page = await base44.entities.product.filter({}, { limit: 100, sort: "-created_date" });
      setProducts(page.items || []);
    } catch (e) {
      setError("Could not load products. Admin access required.");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({}); setForm(EMPTY); setError(""); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "", slug: p.slug || "", category: p.category || "T-Shirts",
      price: p.price ?? "", colors: (p.colors || []).join(", "), sizes: (p.sizes || []).join(", "),
      images: p.images || [], description: p.description || "", materials: p.materials || "",
      care: p.care || "", collections: (p.collections || []).join(", "),
      inventory: p.inventory ?? 0, featured: !!p.featured, isNew: !!p.isNew, published: p.published !== false,
    });
    setError("");
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setForm((f) => ({ ...f, images: [...f.images, file_url] }));
    } catch (err) {
      setError("Image upload failed.");
    }
    setUploading(false);
  };

  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === "") { setError("Name and price are required."); return; }
    setSaving(true); setError("");
    const payload = {
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      category: form.category,
      price: Number(form.price),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((c) => c.trim()).filter(Boolean),
      images: form.images,
      description: form.description,
      materials: form.materials,
      care: form.care,
      collections: form.collections.split(",").map((c) => c.trim()).filter(Boolean),
      inventory: Number(form.inventory) || 0,
      featured: !!form.featured,
      isNew: !!form.isNew,
      published: form.published,
    };
    try {
      if (editing?.id) {
        await base44.entities.product.update(editing.id, payload);
      } else {
        await base44.entities.product.create(payload);
      }
      setEditing(null);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError("Could not save product. Admin access required.");
    }
    setSaving(false);
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try { await base44.entities.product.delete(p.id); load(); } catch (e) { setError("Delete failed."); }
  };

  return (
    <div className="pt-24 md:pt-28">
      <div className="px-5 md:px-8 py-10 md:py-14 flex items-center justify-between">
        <div>
          <p className="eyebrow text-muted-foreground mb-2">Admin</p>
          <h1 className="display text-3xl md:text-5xl">Product Management</h1>
        </div>
        <button onClick={openNew} className="eyebrow bg-deep-black text-ivory px-6 py-3 hover:bg-charcoal transition-colors inline-flex items-center gap-2">
          <Plus size={15} /> New Product
        </button>
      </div>

      <div className="mx-auto max-w-[1300px] px-5 md:px-8 pb-24">
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        {editing !== null ? (
          <form onSubmit={save} className="border border-border p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <p className="eyebrow">{editing?.id ? "Edit Product" : "New Product"}</p>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <FormField label="Name"><input value={form.name} onChange={set("name")} className="adm-input" /></FormField>
              <FormField label="Slug (auto from name if empty)"><input value={form.slug} onChange={set("slug")} className="adm-input" /></FormField>
              <FormField label="Category">
                <select value={form.category} onChange={set("category")} className="adm-input">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Price (₹)"><input type="number" value={form.price} onChange={set("price")} className="adm-input" /></FormField>
              <FormField label="Colours (comma separated)"><input value={form.colors} onChange={set("colors")} className="adm-input" /></FormField>
              <FormField label="Sizes (comma separated)"><input value={form.sizes} onChange={set("sizes")} className="adm-input" /></FormField>
              <FormField label="Collections (comma separated: essentials, core, av01-identity, new-arrivals)"><input value={form.collections} onChange={set("collections")} className="adm-input" /></FormField>
              <FormField label="Inventory"><input type="number" value={form.inventory} onChange={set("inventory")} className="adm-input" /></FormField>
            </div>
            <FormField label="Description"><textarea value={form.description} onChange={set("description")} rows={3} className="adm-input resize-none" /></FormField>
            <div className="grid md:grid-cols-2 gap-5">
              <FormField label="Materials (editable placeholder)"><textarea value={form.materials} onChange={set("materials")} rows={2} className="adm-input resize-none" /></FormField>
              <FormField label="Care (editable placeholder)"><textarea value={form.care} onChange={set("care")} rows={2} className="adm-input resize-none" /></FormField>
            </div>

            <div>
              <p className="eyebrow text-muted-foreground mb-2">Images</p>
              <div className="flex flex-wrap gap-3 mb-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-24 overflow-hidden bg-soft-grey">
                    <Image src={img} alt={`product ${i + 1}`} fittingType="fill" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-ivory/80 h-6 w-6 grid place-items-center"><X size={12} /></button>
                  </div>
                ))}
                <label className="w-20 h-24 border border-dashed border-border grid place-items-center cursor-pointer hover:bg-soft-grey">
                  {uploading ? <div className="h-4 w-4 border-2 border-beige border-t-deep-black rounded-full animate-spin" /> : <Upload size={16} className="text-muted-foreground" />}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={set("published")} className="h-4 w-4 accent-deep-black" /> Published</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-deep-black" /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={set("isNew")} className="h-4 w-4 accent-deep-black" /> New Arrival</label>
            </div>

            <button type="submit" disabled={saving} className="bg-deep-black text-ivory px-8 py-3 eyebrow hover:bg-charcoal transition-colors disabled:opacity-60">
              {saving ? "Saving…" : "Save Product"}
            </button>
          </form>
        ) : loading ? (
          <div className="h-8 w-8 border-4 border-beige border-t-deep-black rounded-full animate-spin" />
        ) : (
          <div className="border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-soft-grey/50">
                <tr className="text-left">
                  <th className="p-4 eyebrow font-medium">Name</th>
                  <th className="p-4 eyebrow font-medium">Category</th>
                  <th className="p-4 eyebrow font-medium">Price</th>
                  <th className="p-4 eyebrow font-medium">Stock</th>
                  <th className="p-4 eyebrow font-medium">Status</th>
                  <th className="p-4 eyebrow font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-4">{p.name}</td>
                    <td className="p-4 text-muted-foreground">{p.category}</td>
                    <td className="p-4 tabular-nums">{formatINR(p.price)}</td>
                    <td className="p-4 tabular-nums">{p.inventory}</td>
                    <td className="p-4">
                      <span className={`eyebrow ${p.published ? "text-accent" : "text-muted-foreground"}`}>{p.published ? "Live" : "Hidden"}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(p)} className="inline-flex items-center gap-1 text-xs hover:text-accent mr-4"><Pencil size={13} /> Edit</button>
                      <button onClick={() => remove(p)} className="inline-flex items-center gap-1 text-xs hover:text-red-600"><Trash2 size={13} /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p className="p-8 text-center text-muted-foreground">No products yet. Create your first product.</p>}
          </div>
        )}
      </div>

      <style>{`.adm-input{width:100%;background:transparent;border:1px solid hsl(var(--border));padding:0.6rem 0.75rem;font-size:0.875rem;outline:none}.adm-input:focus{border-color:hsl(var(--foreground))}`}</style>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground block mb-2">{label}</span>
      {children}
    </label>
  );
}
import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) { setError("Name and message are required."); setStatus("error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Please enter a valid email."); setStatus("error"); return; }
    setError(""); setStatus("loading");
    try {
      await base44.entities.contactmessage.create({ ...form });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError("We could not send your message. Please try again.");
    }
  };

  return (
    <div className="pt-24 md:pt-28">
      <section className="px-5 md:px-8 py-12 md:py-20 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Contact</p>
        <h1 className="display text-4xl md:text-6xl">Get in Touch</h1>
        <p className="mt-5 max-w-xl mx-auto text-foreground/60">Questions, collaborations, or press — we'd like to hear from you.</p>
      </section>

      <div className="mx-auto max-w-xl px-5 md:px-8 pb-24">
        <form onSubmit={submit} className="space-y-6">
          <Field label="Name">
            <input value={form.name} onChange={update("name")} className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={update("email")} className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground" />
          </Field>
          <Field label="Subject">
            <input value={form.subject} onChange={update("subject")} className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground" />
          </Field>
          <Field label="Message">
            <textarea value={form.message} onChange={update("message")} rows={5} className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-foreground resize-none" />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={status === "loading"} className="w-full bg-deep-black text-ivory py-4 eyebrow hover:bg-charcoal transition-colors disabled:opacity-60">
            {status === "loading" ? "Sending…" : "Send Message"}
          </button>
          {status === "success" && (
            <p className="text-center text-accent">Thank you — your message has been received.</p>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground block mb-2">{label}</span>
      {children}
    </label>
  );
}
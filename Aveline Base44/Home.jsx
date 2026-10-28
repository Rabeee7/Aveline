import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { ProductCard } from "@/components/ProductCard";
import { MEDIA, LOOKBOOK, JOURNAL } from "@/data/media";
import { useReveal } from "@/lib/useReveal";
import { useProductList } from "@/hooks/useProducts";
import { base44 } from "@/api/base44Client";

function Section({ children, className = "" }) {
  const ref = useReveal();
  return (
    <section ref={ref} className={`reveal ${className}`}>
      {children}
    </section>
  );
}

export default function Home() {
  const featured = useProductList({ published: true, featured: true }, { limit: 6 });
  const newArrivals = useProductList({ published: true, isNew: true }, { limit: 4 });

  return (
    <div className="bg-ivory">
      {/* A — Cinematic Hero */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-deep-black">
        <div className="absolute inset-0 kenburns">
          <Image src={MEDIA.hero} alt="Aveline editorial — model in structured overcoat against brutalist concrete" fittingType="fill" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black/40 via-transparent to-deep-black/55" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-ivory px-5">
          <p className="eyebrow text-ivory/70 mb-6 reveal is-visible">The New Era of Essentials</p>
          <h1 className="display text-[18vw] md:text-[10rem] leading-none">AVELINE</h1>
          <p className="display italic text-xl md:text-3xl mt-4 text-ivory/90">Timeless Form. Modern Identity.</p>
          <Link
            to="/collections/av01-identity"
            className="mt-10 group inline-flex items-center gap-3 bg-ivory text-deep-black px-8 py-4 eyebrow hover:bg-white transition-colors"
          >
            Explore Collection
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/60 text-[0.65rem] tracking-[0.3em] uppercase animate-pulse">
          Scroll
        </div>
      </section>

      {/* B — Brand Statement */}
      <Section className="py-28 md:py-40 px-5 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow text-muted-foreground mb-10 text-center">The Aveline Philosophy</p>
          <div className="flex flex-col items-center text-center">
            <h2 className="display text-[12vw] md:text-[9rem] leading-[0.9]">FORM.</h2>
            <h2 className="display text-[12vw] md:text-[9rem] leading-[0.9] text-accent">IDENTITY.</h2>
            <h2 className="display text-[12vw] md:text-[9rem] leading-[0.9]">TIMELESSNESS.</h2>
          </div>
          <p className="mt-12 max-w-2xl mx-auto text-center text-lg leading-relaxed text-foreground/70">
            Aveline creates modern essentials for those who define their own identity. Refined silhouettes, considered details, and timeless forms designed beyond seasons.
          </p>
        </div>
      </Section>

      {/* C — Featured Collection */}
      <Section className="py-20 md:py-28 px-5 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow text-muted-foreground mb-3">Featured</p>
              <h2 className="display text-4xl md:text-6xl">The Aveline Collection</h2>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 eyebrow text-muted-foreground hover:text-foreground">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
            {featured.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="eyebrow border border-border px-8 py-4 inline-block">View All</Link>
          </div>
        </div>
      </Section>

      {/* D — Campaign Editorial */}
      <section className="relative h-[80vh] min-h-[480px] w-full overflow-hidden bg-deep-black">
        <Image src={MEDIA.campaign} alt="AV01 — Identity campaign" fittingType="fill" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-deep-black/35" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-ivory px-5">
          <p className="eyebrow text-accent mb-5">Campaign</p>
          <h2 className="display text-5xl md:text-8xl">AV01 — IDENTITY</h2>
          <p className="mt-6 max-w-xl text-ivory/80 text-lg">An exploration of form, movement, and modern identity.</p>
          <Link to="/collections/av01-identity" className="mt-10 eyebrow border border-ivory/60 px-8 py-4 hover:bg-ivory hover:text-deep-black transition-colors">
            View Campaign
          </Link>
        </div>
      </section>

      {/* E — New Arrivals */}
      <Section className="py-20 md:py-28 px-5 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="text-center mb-12">
            <p className="eyebrow text-muted-foreground mb-3">Just In</p>
            <h2 className="display text-4xl md:text-6xl">New Arrivals</h2>
            <p className="mt-4 text-foreground/60">Designed for now. Made beyond seasons.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {newArrivals.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/shop?filter=new" className="eyebrow border border-border px-10 py-4 inline-block hover:bg-deep-black hover:text-ivory transition-colors">
              View All
            </Link>
          </div>
        </div>
      </Section>

      {/* F — Brand Philosophy */}
      <section className="relative bg-deep-black text-ivory py-28 md:py-44 px-5 md:px-8 overflow-hidden">
        <Image src={MEDIA.philosophy} alt="" fittingType="fill" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow text-accent mb-8">Philosophy</p>
          <blockquote className="display text-3xl md:text-5xl leading-[1.15]">
            “Clothing is not simply what you wear. It is what you choose to become.”
          </blockquote>
          <p className="mt-10 max-w-2xl mx-auto text-ivory/70 text-lg leading-relaxed">
            Aveline explores the relationship between clothing and identity — creating pieces that remain relevant beyond trends.
          </p>
        </div>
      </section>

      {/* G — Lookbook */}
      <Section className="py-20 md:py-28 px-5 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow text-muted-foreground mb-3">Editorial</p>
              <h2 className="display text-4xl md:text-6xl">The Lookbook</h2>
            </div>
            <Link to="/lookbook" className="hidden md:inline-flex items-center gap-2 eyebrow text-muted-foreground hover:text-foreground">
              Enter Lookbook <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[220px] md:auto-rows-[320px]">
            <div className="col-span-1 row-span-2 overflow-hidden bg-soft-grey">
              <Image src={LOOKBOOK[0].src} alt="Aveline lookbook — urban form" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.4s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </div>
            <div className="col-span-1 overflow-hidden bg-soft-grey">
              <Image src={LOOKBOOK[1].src} alt="Aveline lookbook — portrait study" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.4s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </div>
            <div className="col-span-1 overflow-hidden bg-soft-grey">
              <Image src={LOOKBOOK[3].src} alt="Aveline lookbook — the overcoat" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.4s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </div>
            <div className="col-span-2 overflow-hidden bg-soft-grey">
              <Image src={LOOKBOOK[2].src} alt="Aveline lookbook — architecture" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.4s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </div>
            <div className="col-span-1 overflow-hidden bg-soft-grey">
              <Image src={LOOKBOOK[5].src} alt="Aveline lookbook — atelier" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.4s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </div>
            <div className="col-span-1 overflow-hidden bg-soft-grey">
              <Image src={LOOKBOOK[4].src} alt="Aveline lookbook — movement" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.4s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </div>
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link to="/lookbook" className="eyebrow border border-border px-8 py-4 inline-block">Enter Lookbook</Link>
          </div>
        </div>
      </Section>

      {/* H — About Aveline */}
      <Section className="grid md:grid-cols-2 min-h-[80vh]">
        <div className="relative bg-soft-grey min-h-[50vh]">
          <Image src={MEDIA.about} alt="About Aveline — atelier portrait" fittingType="fill" className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center px-8 md:px-16 py-16 md:py-24">
          <div className="max-w-md">
            <p className="eyebrow text-muted-foreground mb-5">About</p>
            <h2 className="display text-4xl md:text-6xl mb-8">About Aveline</h2>
            <p className="text-foreground/70 leading-relaxed mb-6">
              Aveline was created around a simple idea — that true style does not need to be loud.
            </p>
            <p className="text-foreground/70 leading-relaxed mb-10">
              We create contemporary clothing where minimal form meets individual identity. Every piece is designed with a focus on silhouette, proportion, detail, and longevity.
            </p>
            <Link to="/about" className="eyebrow border border-deep-black px-8 py-4 inline-block hover:bg-deep-black hover:text-ivory transition-colors">
              Discover Aveline
            </Link>
          </div>
        </div>
      </Section>

      {/* I — Journal */}
      <Section className="py-20 md:py-28 px-5 md:px-8 bg-soft-grey/40">
        <div className="mx-auto max-w-[1500px]">
          <div className="text-center mb-12">
            <p className="eyebrow text-muted-foreground mb-3">Read</p>
            <h2 className="display text-4xl md:text-6xl">The Aveline Journal</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {JOURNAL.map((a) => (
              <Link key={a.slug} to={`/journal/${a.slug}`} className="group flex flex-col">
                <div className="overflow-hidden bg-soft-grey aspect-[3/4]">
                  <Image src={a.image} alt={a.title} fittingType="fill" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1.4s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
                </div>
                <p className="eyebrow text-accent mt-5">{a.category}</p>
                <h3 className="display text-2xl mt-2">{a.title}</h3>
                <p className="text-foreground/60 mt-3 text-sm leading-relaxed">{a.excerpt}</p>
                <span className="eyebrow mt-4 inline-flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                  Read Article <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* J — Newsletter */}
      <NewsletterSection />
    </div>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setError("");
    setStatus("loading");
    try {
      await base44.entities.newsletter.create({ email });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError("We could not save your subscription. Please try again.");
    }
  };

  return (
    <section className="bg-deep-black text-ivory py-28 md:py-40 px-5 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-accent mb-6">Newsletter</p>
        <h2 className="display text-4xl md:text-6xl">Enter the Aveline World</h2>
        <p className="mt-6 text-ivory/70 text-lg">
          Be the first to discover new collections, campaigns, stories, and exclusive releases.
        </p>
        <form onSubmit={submit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            aria-label="Email address"
            className="flex-1 bg-transparent border-b border-ivory/30 focus:border-ivory outline-none py-3 text-ivory placeholder:text-ivory/40"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-ivory text-deep-black px-8 py-4 eyebrow hover:bg-white transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Joining…" : "Join Aveline"}
          </button>
        </form>
        {status === "success" && (
          <p className="mt-5 text-accent text-sm">Welcome to Aveline. Your subscription has been saved.</p>
        )}
        {status === "error" && (
          <p className="mt-5 text-red-300 text-sm">{error}</p>
        )}
      </div>
    </section>
  );
}
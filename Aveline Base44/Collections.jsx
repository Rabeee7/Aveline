import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { COLLECTIONS } from "@/data/products";

export default function Collections() {
  return (
    <div className="pt-24 md:pt-28">
      <div className="px-5 md:px-8 py-12 md:py-20 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Collections</p>
        <h1 className="display text-4xl md:text-6xl">Explore the Collections</h1>
        <p className="mt-5 max-w-xl mx-auto text-foreground/60">Curated edits across the Aveline universe — from everyday essentials to seasonal campaigns.</p>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 md:px-8 pb-24 space-y-6 md:space-y-8">
        {COLLECTIONS.map((c, i) => (
          <Link
            key={c.slug}
            to={`/collections/${c.slug}`}
            className={`group relative block overflow-hidden bg-deep-black ${i % 2 === 0 ? "md:h-[60vh]" : "md:h-[60vh]"} h-[50vh]`}
          >
            <Image src={c.image} alt={c.name} fittingType="fill" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-70 group-hover:scale-105 transition-all duration-[1.4s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black/70 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-8 md:p-14 text-ivory">
              <p className="eyebrow text-accent mb-3">Collection</p>
              <h2 className="display text-3xl md:text-6xl">{c.name}</h2>
              <p className="mt-3 max-w-md text-ivory/80">{c.tagline}</p>
              <span className="mt-6 inline-flex items-center gap-2 eyebrow">
                Discover <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
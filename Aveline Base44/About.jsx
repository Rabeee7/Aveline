import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { MEDIA } from "@/data/media";
import { useReveal } from "@/lib/useReveal";

export default function About() {
  const ref = useReveal();
  return (
    <div className="pt-24 md:pt-28">
      <section className="relative h-[60vh] min-h-[380px] overflow-hidden bg-deep-black">
        <Image src={MEDIA.about} alt="About Aveline" fittingType="fill" className="absolute inset-0 h-full w-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-deep-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-ivory px-5">
          <p className="eyebrow text-accent mb-4">About</p>
          <h1 className="display text-5xl md:text-8xl">Aveline</h1>
        </div>
      </section>

      <section ref={ref} className="reveal mx-auto max-w-3xl px-5 md:px-8 py-20 md:py-32 text-center">
        <p className="eyebrow text-muted-foreground mb-6">Our Idea</p>
        <h2 className="display text-3xl md:text-5xl leading-tight">
          True style does not need to be loud.
        </h2>
        <p className="mt-8 text-lg text-foreground/70 leading-relaxed">
          Aveline was created around a simple idea — that contemporary clothing can be minimal without losing identity. We design pieces where form, proportion, and detail speak quietly but clearly.
        </p>
        <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
          Every collection is built beyond seasons, for men, women, and those who refuse to be categorised. We believe in fewer, better things — made to endure, made to be lived in.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-0 border-y border-border">
        {[
          { k: "Form", v: "Refined silhouettes and considered proportion." },
          { k: "Identity", v: "Pieces that invite individual expression." },
          { k: "Timelessness", v: "Designed beyond the noise of seasons." },
        ].map((p) => (
          <div key={p.k} className="p-10 md:p-14 text-center border-b md:border-b-0 md:border-r border-border last:border-r-0">
            <h3 className="display text-3xl mb-3">{p.k}</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">{p.v}</p>
          </div>
        ))}
      </section>

      <section className="py-20 md:py-28 px-5 md:px-8 text-center">
        <h2 className="display text-3xl md:text-5xl mb-6">Discover the Collection</h2>
        <Link to="/shop" className="eyebrow border border-deep-black px-10 py-4 inline-block hover:bg-deep-black hover:text-ivory transition-colors">Shop Aveline</Link>
      </section>
    </div>
  );
}
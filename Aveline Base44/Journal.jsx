import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { JOURNAL } from "@/data/media";

export default function Journal() {
  return (
    <div className="pt-24 md:pt-28">
      <section className="px-5 md:px-8 py-12 md:py-20 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Journal</p>
        <h1 className="display text-5xl md:text-8xl">The Aveline Journal</h1>
        <p className="mt-5 max-w-xl mx-auto text-foreground/60">Thoughts on minimalism, modern wardrobes, and the language of contemporary form.</p>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 md:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {JOURNAL.map((a) => (
            <Link key={a.slug} to={`/journal/${a.slug}`} className="group flex flex-col">
              <div className="overflow-hidden bg-soft-grey aspect-[3/4]">
                <Image src={a.image} alt={a.title} fittingType="fill" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1.4s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </div>
              <p className="eyebrow text-accent mt-5">{a.category}</p>
              <h2 className="display text-2xl mt-2">{a.title}</h2>
              <p className="text-foreground/60 mt-3 text-sm leading-relaxed">{a.excerpt}</p>
              <span className="eyebrow mt-4 inline-flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                Read Article <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
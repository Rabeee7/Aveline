import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { LOOKBOOK, MEDIA } from "@/data/media";
import { useReveal } from "@/lib/useReveal";

export default function Lookbook() {
  const ref = useReveal();
  return (
    <div className="pt-24 md:pt-28">
      <section className="px-5 md:px-8 py-12 md:py-20 text-center">
        <p className="eyebrow text-muted-foreground mb-3">Editorial</p>
        <h1 className="display text-5xl md:text-8xl">The Lookbook</h1>
        <p className="mt-5 max-w-xl mx-auto text-foreground/60">A study of form, movement, and modern identity — photographed across architecture and street.</p>
      </section>

      <section ref={ref} className="reveal mx-auto max-w-[1500px] px-5 md:px-8 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[300px]">
          <div className="col-span-2 md:col-span-7 row-span-2 overflow-hidden bg-soft-grey">
            <Image src={LOOKBOOK[0].src} alt="Aveline lookbook — urban form" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.6s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
          </div>
          <div className="col-span-1 md:col-span-5 overflow-hidden bg-soft-grey">
            <Image src={LOOKBOOK[1].src} alt="Aveline lookbook — portrait study" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.6s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
          </div>
          <div className="col-span-1 md:col-span-5 overflow-hidden bg-soft-grey">
            <Image src={LOOKBOOK[2].src} alt="Aveline lookbook — architecture" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.6s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
          </div>
          <div className="col-span-1 md:col-span-4 overflow-hidden bg-soft-grey">
            <Image src={LOOKBOOK[3].src} alt="Aveline lookbook — the overcoat" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.6s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
          </div>
          <div className="col-span-1 md:col-span-4 overflow-hidden bg-soft-grey">
            <Image src={LOOKBOOK[4].src} alt="Aveline lookbook — movement" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.6s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
          </div>
          <div className="col-span-2 md:col-span-4 overflow-hidden bg-soft-grey">
            <Image src={LOOKBOOK[5].src} alt="Aveline lookbook — atelier" fittingType="fill" className="h-full w-full object-cover hover:scale-105 transition-transform duration-[1.6s] ease-[cubic-bezier(0.23,1,0.32,1)]" />
          </div>
        </div>
      </section>

      <section className="relative h-[70vh] min-h-[420px] overflow-hidden bg-deep-black mt-6">
        <Image src={MEDIA.campaign} alt="AV01 campaign" fittingType="fill" className="absolute inset-0 h-full w-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-deep-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-ivory px-5">
          <p className="eyebrow text-accent mb-5">AV01 — Identity</p>
          <h2 className="display text-4xl md:text-7xl">Wear the Form</h2>
          <Link to="/collections/av01-identity" className="mt-10 eyebrow border border-ivory/60 px-8 py-4 hover:bg-ivory hover:text-deep-black transition-colors inline-flex items-center gap-2">
            Shop the Campaign <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
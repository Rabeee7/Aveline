import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Image } from "@/components/ui/image";
import { JOURNAL } from "@/data/media";

export default function JournalArticle() {
  const { slug } = useParams();
  const article = JOURNAL.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="pt-40 pb-40 text-center px-5">
        <p className="display text-3xl mb-4">Article not found</p>
        <Link to="/journal" className="eyebrow border border-border px-8 py-4 inline-block">Back to Journal</Link>
      </div>
    );
  }

  return (
    <article className="pt-24 md:pt-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-12 md:py-16">
        <Link to="/journal" className="eyebrow text-muted-foreground hover:text-foreground inline-flex items-center gap-2 mb-8">
          <ArrowLeft size={14} /> Back to Journal
        </Link>
        <p className="eyebrow text-accent mb-4">{article.category} · {article.date}</p>
        <h1 className="display text-4xl md:text-6xl leading-tight">{article.title}</h1>
        <p className="mt-6 text-xl text-foreground/70 leading-relaxed">{article.excerpt}</p>
      </div>

      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="overflow-hidden bg-soft-grey aspect-[16/10]">
          <Image src={article.image} alt={article.title} fittingType="fill" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 md:px-8 py-14 md:py-20">
        <p className="text-lg leading-relaxed text-foreground/80">{article.body}</p>
        <p className="mt-6 text-lg leading-relaxed text-foreground/80">
          This is an editorial placeholder. Replace with the full article when ready — the structure supports adding longer-form copy, additional imagery, and future articles without code changes.
        </p>
      </div>
    </article>
  );
}
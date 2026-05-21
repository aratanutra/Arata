import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { readContent } from "@/lib/content";
import { asset } from "@/lib/asset";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import Newsletter from "@/components/public/Newsletter";
import ContactDialog from "@/components/public/ContactDialog";

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const content = await readContent();
  return content.blog.posts.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const content = await readContent();
  const post = content.blog.posts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Journal · Arata Nutraceuticals" };
  return {
    title: `${post.title} · Arata Nutraceuticals`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" }
  };
}

export default async function JournalPostPage({ params }: Params) {
  const content = await readContent();
  const post = content.blog.posts.find((p) => p.slug === params.slug && p.published);
  if (!post) notFound();

  const paragraphs = (post.body && post.body.trim().length > 0 ? post.body : post.excerpt)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />

      <article className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container-tight">
          <Link
            href="/#blog"
            className="text-[12px] font-medium uppercase tracking-widest text-muted transition-colors hover:text-ink"
          >
            ← Back to Journal
          </Link>

          <header className="mt-8">
            <span className="eyebrow">{content.blog.eyebrow}</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {post.excerpt}
            </p>
          </header>

          {post.image ? (
            <div className="mt-12 overflow-hidden rounded-3xl border border-hairline bg-mist">
              <div
                className="aspect-[16/9] w-full"
                style={{
                  backgroundImage: `url(${asset(post.image)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
                role="img"
                aria-label={post.title}
              />
            </div>
          ) : null}

          <div className="mt-12 space-y-6 text-[17px] leading-[1.75] text-ink-soft md:text-lg">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-16 border-t border-hairline pt-8">
            <Link
              href="/#blog"
              className="text-[12px] font-medium uppercase tracking-widest text-sage hover:text-sage-deep"
            >
              ← More from the Journal
            </Link>
          </div>
        </div>
      </article>

      <Newsletter data={content.newsletter} />
      <Footer brand={content.brand} footer={content.footer} />
      <ContactDialog contactForm={content.contactForm} />
    </main>
  );
}

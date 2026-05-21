import type { Metadata } from "next";
import Link from "next/link";
import { readContent } from "@/lib/content";
import { asset } from "@/lib/asset";
import Nav from "@/components/public/Nav";
import Newsletter from "@/components/public/Newsletter";
import Footer from "@/components/public/Footer";
import ContactDialog from "@/components/public/ContactDialog";

export const metadata: Metadata = {
  title: "Journal · Arata Nutraceuticals",
  description: "Long-form notes from the Arata laboratory. Trial breakdowns, dose rationale, mechanism essays."
};

export default async function JournalIndex() {
  const content = await readContent();
  const posts = content.blog.posts.filter((p) => p.published);

  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-app">
          <span className="eyebrow">{content.blog.eyebrow}</span>
          <h1 className="mt-4 heading-lg max-w-3xl">{content.blog.title}</h1>
          <p className="mt-5 max-w-2xl lede">
            Long-form notes from the laboratory. Trial breakdowns, dose rationale, mechanism essays. Written for readers who want the citation, not the slogan.
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-app">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="card group overflow-hidden hover:shadow-card">
                <Link href={`/journal/${post.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
                    {post.image ? (
                      <div
                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                        style={{
                          backgroundImage: `url(${asset(post.image)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }}
                      />
                    ) : null}
                    <div className="absolute left-4 top-4 rounded-full bg-canvas/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink backdrop-blur">
                      Essay
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-sage-deep">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted">{post.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-widest text-muted">
                        Read essay
                      </span>
                      <span className="text-sage">→</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Newsletter data={content.newsletter} />
      <Footer brand={content.brand} footer={content.footer} />
      <ContactDialog contactForm={content.contactForm} />
    </main>
  );
}

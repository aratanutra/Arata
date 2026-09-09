import type { PolicyDocument, SiteContent } from "@/types/content";

type Props = {
  document: PolicyDocument;
  grievance: SiteContent["policies"]["grievance"];
  updatedAt: string;
  showGrievance?: boolean;
};

export default function PolicyPage({ document, grievance, updatedAt, showGrievance = false }: Props) {
  return (
    <section className="relative bg-canvas pt-28 pb-20 md:pt-36 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_at_top,_rgba(184,147,94,0.08)_0%,_transparent_60%)]"
      />
      <div className="container-app relative">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow">{document.eyebrow}</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            {document.title}
          </h1>
          <p className="mt-4 lede">{document.summary}</p>
          <p className="mt-2 text-[12px] font-medium uppercase tracking-widest text-muted">
            Last updated: {updatedAt}
          </p>

          <div className="mt-10 space-y-10">
            {document.sections.map((section, i) => (
              <div key={i} className="space-y-4">
                {section.heading ? (
                  <h2 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                    {section.heading}
                  </h2>
                ) : null}
                {section.intro ? (
                  <p className="text-[15px] leading-relaxed text-ink-soft md:text-base">
                    {section.intro}
                  </p>
                ) : null}
                {section.paragraphs?.map((p, j) => (
                  <p
                    key={j}
                    className="text-[15px] leading-relaxed text-ink-soft md:text-base"
                  >
                    {p}
                  </p>
                ))}
                {section.list ? (
                  section.list.ordered ? (
                    <ol className="list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-ink-soft marker:text-gold-deep md:text-base">
                      {section.list.items.map((item, k) => (
                        <li key={k} className="pl-1">
                          {item}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="list-disc space-y-3 pl-5 text-[15px] leading-relaxed text-ink-soft marker:text-gold-deep md:text-base">
                      {section.list.items.map((item, k) => (
                        <li key={k} className="pl-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )
                ) : null}
              </div>
            ))}
          </div>

          {showGrievance ? (
            <div className="mt-14 rounded-2xl border border-hairline bg-paper p-6 md:p-8">
              <h2 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                Grievance Officer
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
                In accordance with the Information Technology Act, 2000 and the rules made
                thereunder, the details of the Grievance Officer are provided below.
              </p>
              <dl className="mt-5 grid gap-3 text-[14px] leading-relaxed text-ink-soft md:grid-cols-2 md:text-[15px]">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    Designation
                  </dt>
                  <dd className="mt-1">{grievance.designation}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    Company
                  </dt>
                  <dd className="mt-1">{grievance.company}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    Address
                  </dt>
                  <dd className="mt-1">{grievance.address}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${grievance.email}`}
                      className="underline decoration-hairline underline-offset-4 hover:text-gold-deep hover:decoration-gold-deep"
                    >
                      {grievance.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    Phone
                  </dt>
                  <dd className="mt-1 tnum">{grievance.phone}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    Hours
                  </dt>
                  <dd className="mt-1">{grievance.hours}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

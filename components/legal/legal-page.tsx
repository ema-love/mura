import Link from "next/link";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { legalDocs, type LegalBlock, type LegalDoc, type LegalDocId } from "@/lib/legal";

/** Turns email addresses in the owner's text into mailto links, without altering the words. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi);
  return (
    <>
      {parts.map((part, i) =>
        /@/.test(part) && i % 2 === 1 ? (
          <a key={i} href={`mailto:${part}`} className="font-medium text-foreground underline underline-offset-4">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.type === "p" ? (
          <p key={i} className="mt-4 leading-[1.8] text-pretty text-foreground/85">
            <Linkified text={b.text} />
          </p>
        ) : b.type === "h3" ? (
          <h3 key={i} className="mt-8 text-lg font-semibold tracking-[-0.01em]">
            {b.text}
          </h3>
        ) : (
          <ul key={i} className="mt-4 space-y-2 leading-relaxed text-foreground/85">
            {b.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-accent-ink" aria-hidden />
                <span>
                  <Linkified text={item} />
                </span>
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

export function LegalPage({ id, doc }: { id: LegalDocId; doc: LegalDoc }) {
  const others = (Object.keys(legalDocs) as LegalDocId[]).filter((k) => k !== id);
  return (
    <>
      <Nav />
      <main id="main" className="pt-32 md:pt-40">
        <div className="page">
          <header className="max-w-3xl">
            <p className="eyebrow">Legal</p>
            <h1 className="headline mt-6 text-4xl md:text-6xl">{doc.title}</h1>
            {doc.lastUpdated && <p className="mt-5 text-sm text-muted-foreground">Last updated: {doc.lastUpdated}</p>}
          </header>

          <div className="mt-14 grid gap-12 pb-section lg:grid-cols-[16rem_1fr] lg:gap-20">
            <nav aria-label="On this page" className="hidden lg:block">
              <div className="sticky top-28">
                <p className="eyebrow !text-[10px]">On this page</p>
                <ol className="mt-4 space-y-2 text-sm">
                  {doc.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-muted-foreground transition-colors hover:text-foreground">
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <article className="max-w-[680px] text-[16px]">
              {doc.intro.length > 0 && (
                <div className="border-b pb-8">
                  <Blocks blocks={doc.intro} />
                </div>
              )}
              {doc.sections.map((s) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 border-b py-8 last:border-b-0">
                  <h2 id={`${s.id}-h`} className="text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                    {s.heading}
                  </h2>
                  <Blocks blocks={s.blocks} />
                </section>
              ))}

              <nav aria-label="Other policies" className="mt-12 flex flex-wrap gap-2">
                {others.map((k) => (
                  <Link
                    key={k}
                    href={legalDocs[k].path}
                    className="inline-flex rounded-full bg-card px-4 py-2 text-sm font-medium hairline transition-colors hover:bg-accent-soft"
                  >
                    {legalDocs[k].label}
                  </Link>
                ))}
              </nav>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

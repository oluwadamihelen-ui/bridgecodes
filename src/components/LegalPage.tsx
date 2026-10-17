import { PageHero } from "./PageHero";
import { RichText } from "./RichText";
import { legalDocs, legalEffectiveDate } from "@/content/legal";
import { site } from "@/config/site";

export function LegalPage({ slug }: { slug: keyof typeof legalDocs }) {
  const doc = legalDocs[slug];
  return (
    <>
      <PageHero title={doc.title} crumbs={[{ name: doc.title, path: `/${doc.slug}` }]}>
        <p className="muted">
          Effective date: <RichText text={legalEffectiveDate} /> · {site.legalOwner}
        </p>
      </PageHero>
      <section className="section">
        <div className="container">
          {!site.legal.reviewed && (
            <div className="note note--warn prose" role="note" style={{ marginBottom: 28 }}>
              <p><strong>Draft — not legally reviewed.</strong> This page is an editable template and is not legal advice. Highlighted items are unresolved and must be confirmed, and a qualified lawyer should review this page before publication.</p>
              <ul className="plain-list">
                {doc.reviewNotes.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
          )}
          <div className="prose">
            <p className="lead" style={{ fontSize: "1.1rem" }}><RichText text={doc.intro} /></p>
            <nav className="toc" aria-label="On this page">
              <strong>On this page</strong>
              <ol>{doc.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol>
            </nav>
            {doc.sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2>{s.title}</h2>
                {s.body.map((b, i) =>
                  typeof b === "string" ? (
                    <p key={i}><RichText text={b} /></p>
                  ) : (
                    <ul key={i}>{b.list.map((li) => <li key={li}><RichText text={li} /></li>)}</ul>
                  ),
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

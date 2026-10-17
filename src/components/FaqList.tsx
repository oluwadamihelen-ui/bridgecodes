import { RichText } from "./RichText";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p><RichText text={f.a} /></p>
        </details>
      ))}
    </div>
  );
}

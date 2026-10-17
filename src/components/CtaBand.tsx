import { Button } from "./Button";

export function CtaBand({
  title = "Have a Problem Worth Solving?",
  text = "Tell us what you are building, and let's explore the right technology solution.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container cta-band__inner">
        <h2 id="cta-title">{title}</h2>
        <p>{text}</p>
        <div className="btn-row btn-row--center">
          <Button href="/contact" variant="light">Contact Our Team</Button>
          <Button href="/products" variant="outline-light">Explore Products</Button>
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/Button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", maxWidth: 640 }}>
        <p className="eyebrow">404</p>
        <h1>We couldn’t find that page.</h1>
        <p className="lead" style={{ marginInline: "auto" }}>
          The page may have moved or the address may be mistyped.
        </p>
        <div className="btn-row btn-row--center">
          <Button href="/">Go to homepage</Button>
          <Button href="/products" variant="secondary">Explore products</Button>
        </div>
      </div>
    </section>
  );
}

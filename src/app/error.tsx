"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", maxWidth: 640 }}>
        <h1>Something went wrong.</h1>
        <p className="lead" style={{ marginInline: "auto" }}>An unexpected error occurred. Please try again.</p>
        <div className="btn-row btn-row--center">
          <button type="button" className="btn btn--primary" onClick={reset}>Try again</button>
        </div>
      </div>
    </section>
  );
}

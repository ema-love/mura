"use client";

/** Replaces the root layout when it fails, so it carries its own minimal, on-brand styling. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#fafaf8",
          color: "#1f1f1f",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          textAlign: "center",
          padding: 20,
        }}
      >
        <title>Something went wrong · MÚRÀ</title>
        <main>
          <p style={{ letterSpacing: "0.14em", fontWeight: 600 }}>MÚRÀ</p>
          <h1 style={{ fontSize: 40, letterSpacing: "-0.03em", margin: "24px 0 12px" }}>Something went wrong.</h1>
          <p style={{ color: "#6e6e6a", margin: "0 0 32px" }}>Please try again in a moment.</p>
          <button
            onClick={() => retry()}
            style={{ background: "#1f1f1f", color: "#fafaf8", border: 0, borderRadius: 999, padding: "14px 28px", fontSize: 15, cursor: "pointer" }}
          >
            Try again
          </button>
          {error.digest && <p style={{ marginTop: 28, fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#9a9a95" }}>Reference: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}

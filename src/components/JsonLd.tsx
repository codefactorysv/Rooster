import Script from "next/script";

/**
 * Renders a structured-data graph. Every page uses this so the markup is
 * emitted the same way everywhere and the `@id` graph stays consistent.
 */
export function JsonLd({ id, data }: { id: string; data: unknown }) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

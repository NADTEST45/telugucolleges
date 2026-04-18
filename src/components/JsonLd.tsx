/**
 * Inline JSON-LD structured data.
 *
 * Renders a <script type="application/ld+json"> with the given payload.
 * Use on server components only — the data is serialized at render time.
 *
 * Safe-by-default: we strip `</` sequences from the serialized output to
 * prevent script-tag breakout if any untrusted string ever ends up in the
 * payload. (All current usages pass static or server-sourced data.)
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

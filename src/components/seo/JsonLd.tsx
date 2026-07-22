export function JsonLd({ data }: { data: object }) {
  // Escaping "</" prevents a string value containing a literal
  // "</script>" sequence from prematurely closing this script tag and
  // letting the rest of the JSON be interpreted as raw HTML — a known
  // JSON-LD injection vector, defended against here regardless of how
  // unlikely a malicious value currently is to reach this component.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
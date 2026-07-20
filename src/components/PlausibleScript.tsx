// PROVISIONING: requires NEXT_PUBLIC_PLAUSIBLE_DOMAIN to activate. Without it, returns null.

export default function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <script
      defer
      data-domain={domain}
      // tagged-events.outbound-links: supports data-event-* attributes + auto outbound link tracking
      src="https://plausible.io/js/script.tagged-events.outbound-links.js"
    />
  );
}

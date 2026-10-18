// Security utilities: URL validation and protocol sanitization

export function sanitizeUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // Enforce http or https protocol to block javascript:, vbscript:, and malicious data: URLs
  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // If not a full URL, ensure it doesn't contain dangerous pseudo-protocols
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
      return `https://${trimmed}`;
    }
  }

  return undefined;
}

export function sanitizeText(text?: string | null): string {
  if (!text) return '';
  return text.trim();
}

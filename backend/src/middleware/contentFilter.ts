// Blocks phone numbers, WhatsApp numbers, and external social handles
// to keep negotiation anonymous and on-platform

const PHONE_REGEX = /(\+?\d[\s\-.]?){9,13}\d/g;
const WHATSAPP_REGEX = /whatsapp\s*:?\s*(\+?\d[\s\-.]?){8,}/gi;
const INSTAGRAM_REGEX = /@[a-zA-Z0-9._]{1,30}(\s|$)/g;
const TELEGRAM_REGEX = /t\.me\/[a-zA-Z0-9_]+/gi;
const FACEBOOK_REGEX = /facebook\.com\/[a-zA-Z0-9.]+/gi;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const SNAPCHAT_REGEX = /snapchat\s*:?\s*[a-zA-Z0-9._\-]+/gi;

export function containsBlockedContent(text: string): boolean {
  return (
    PHONE_REGEX.test(text) ||
    WHATSAPP_REGEX.test(text) ||
    INSTAGRAM_REGEX.test(text) ||
    TELEGRAM_REGEX.test(text) ||
    FACEBOOK_REGEX.test(text) ||
    EMAIL_REGEX.test(text) ||
    SNAPCHAT_REGEX.test(text)
  );
}

export function sanitizeMessage(text: string): string {
  // Reset regex lastIndex before each use (stateful regex issue)
  const patterns = [
    /(\+?\d[\s\-.]?){9,13}\d/g,
    /whatsapp\s*:?\s*(\+?\d[\s\-.]?){8,}/gi,
    /@[a-zA-Z0-9._]{1,30}(\s|$)/g,
    /t\.me\/[a-zA-Z0-9_]+/gi,
    /facebook\.com\/[a-zA-Z0-9.]+/gi,
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    /snapchat\s*:?\s*[a-zA-Z0-9._\-]+/gi,
  ];

  let sanitized = text;
  for (const pattern of patterns) {
    sanitized = sanitized.replace(pattern, '[BLOCKED]');
  }
  return sanitized;
}

/**
 * Disposable email domain blocklist — nejčastěji zneužívané domény.
 * Aktualizováno: 2026-05. Plný seznam: github.com/disposable-email-domains
 */
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info',
  'throwam.com', 'throwam.net', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'trashmail.at', 'trashmail.io', 'trashmail.org', 'trashmail.xyz',
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'tempmail.com', 'tempmail.net', 'tempmail.org', 'temp-mail.org',
  'temp-mail.io', 'tmpmail.net', 'tmpmail.org',
  'sharklasers.com', 'guerrillamailblock.com', 'spam4.me',
  'dispostable.com', 'maildrop.cc', 'mailnull.com',
  'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'mailnesia.com', 'spamfree24.org', 'spamfree24.de',
  'spam.la', 'getairmail.com', 'filzmail.com',
  'getnada.com', 'nada.email', 'mailsac.com',
  'inboxbear.com', 'fakemail.net', 'fakeinbox.com',
  'mailexpire.com', '33mail.com', 'mailnew.com',
  'discard.email', 'spamhereplease.com', 'sogetthis.com',
  'binkmail.com', 'bobmail.info', 'chammy.info',
  'devnullmail.com', 'letthemeatspam.com', 'mailin8r.com',
  'mailandftp.com', 'mailbucket.org', 'mailforspam.com',
  'spamherelots.com', 'spamthisplease.com', 'yuurok.com',
  'harakirimail.com', 'proxymail.eu', 'safetymail.info',
  'spamgob.com', 'tempinbox.com', 'throwam.com',
  'spaml.de', 'no-spam.ws', 'nospamfor.us',
  'objectmail.com', 'rklips.com', 'rmqkr.net',
])

/**
 * Vrací true pokud je email z disposable / dočasné domény.
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return false
  return DISPOSABLE_DOMAINS.has(domain)
}

import dns from 'dns';

const DISPOSABLE_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'temp-mail.org', 'fakeinbox.com', 'throwawaymail.com', 'yopmail.com'
];

const ROLE_PREFIXES = [
  'info', 'support', 'admin', 'sales', 'contact', 'billing', 'help', 'team'
];

const FREE_MAIL_PROVIDERS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'icloud.com'
];

export async function verifyEmail(email: string) {
  const result: any = {
    email,
    status: 'Unverified',
    reason: '',
    checks: {
      syntaxValid: false,
      domainValid: false,
      mxFound: false,
      disposable: false,
      roleBased: false,
      riskyPattern: false
    }
  };

  // 1. Syntax Validation
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(email)) {
    result.status = 'Unverified';
    result.reason = 'Invalid email format.';
    return result;
  }
  
  result.checks.syntaxValid = true;

  const [localPart, domain] = email.split('@');
  const lowerLocalPart = localPart.toLowerCase();
  const lowerDomain = domain.toLowerCase();

  // 2. Disposable Email Detection
  const isDisposable = DISPOSABLE_DOMAINS.some(d => lowerDomain.includes(d) || lowerDomain === d.split('.')[0] || d.startsWith(lowerDomain)) 
    || lowerDomain.includes('tempmail') 
    || lowerDomain.includes('10minutemail') 
    || lowerDomain.includes('guerrillamail') 
    || lowerDomain.includes('mailinator');
  
  result.checks.disposable = isDisposable;

  // 4. Role-Based Email Detection
  const isRoleBased = ROLE_PREFIXES.includes(lowerLocalPart);
  result.checks.roleBased = isRoleBased;

  // Risky pattern
  result.checks.riskyPattern = isDisposable || lowerDomain.includes('spam');

  // MX Record Check
  let hasMx = false;
  let dnsLookupFailed = false;
  try {
    const addresses = await dns.promises.resolve(lowerDomain);
    result.checks.domainValid = addresses && addresses.length > 0;
  } catch (error: any) {
    result.checks.domainValid = false;
  }

  try {
    const mxRecords = await dns.promises.resolveMx(lowerDomain);
    hasMx = mxRecords && mxRecords.length > 0;
    result.checks.mxFound = hasMx;
    if (!result.checks.domainValid) {
        result.checks.domainValid = hasMx;
    }
  } catch (error: any) {
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      hasMx = false;
      result.checks.mxFound = false;
    } else {
      dnsLookupFailed = true;
    }
  }

  // Status mapping
  if (!result.checks.domainValid && !hasMx && !dnsLookupFailed) {
      result.status = 'Unverified';
      result.reason = 'Invalid domain.';
      return result;
  }

  if (isDisposable || result.checks.riskyPattern) {
    result.status = 'Unverified';
    result.reason = isDisposable ? 'Disposable email domain detected.' : 'Risky/spam email detected.';
    return result;
  }

  if (dnsLookupFailed) {
    // Treat as unverified if we can't look it up reasonably, though user might want unknown
    // Let's use Not Found / Hazard or just Unverified
    // Actually, user says: "Unknown: DNS lookup failed or timeout" Oh wait, the prompt says "Use 3 main statuses: Verified, Not Found / Hazard, Unverified."
    // Let's map DNS failed to Unverified in 3-status system, or Not Found / Hazard. "Domain has no MX records" is Unverified.
    result.status = 'Unverified';
    result.reason = 'DNS lookup failed or timeout.';
    return result;
  }

  if (!hasMx) {
    result.status = 'Unverified';
    result.reason = 'Domain has no MX records.';
    return result;
  }

  const isFreeMail = FREE_MAIL_PROVIDERS.includes(lowerDomain);

  if (isRoleBased) {
    result.status = 'Not Found / Hazard';
    result.reason = 'Role-based address.';
    return result;
  }

  if (isFreeMail) {
    result.status = 'Not Found / Hazard';
    result.reason = 'Mailbox existence cannot be confirmed without SMTP.';
    return result;
  }

  result.status = 'Verified';
  result.reason = 'Valid syntax + MX record exists. Domain accepts mail.';
  return result;
}

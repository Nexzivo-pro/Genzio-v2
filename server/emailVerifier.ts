import dns from 'dns';

const DISPOSABLE_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'temp-mail.org', 'fakeinbox.com', 'throwawaymail.com', 'yopmail.com'
];

const ROLE_PREFIXES = [
  'info', 'support', 'admin', 'sales', 'contact', 'billing', 'help', 'team'
];

export async function verifyEmail(email: string) {
  // 1. Syntax Validation
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(email)) {
    return {
      email,
      status: 'Invalid',
      reason: 'Invalid format',
      checks: { syntax: false, mx: false, disposable: false, role: false }
    };
  }

  const [localPart, domain] = email.split('@');
  const lowerLocalPart = localPart.toLowerCase();
  const lowerDomain = domain.toLowerCase();

  // 2. MX Record Check (Must check before deciding if it's risky/verified)
  let hasMx = false;
  let dnsLookupFailed = false;
  try {
    const mxRecords = await dns.promises.resolveMx(domain);
    hasMx = mxRecords && mxRecords.length > 0;
  } catch (error: any) {
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      hasMx = false;
    } else {
      dnsLookupFailed = true;
    }
  }

  // 3. Disposable Email Detection
  const isDisposable = DISPOSABLE_DOMAINS.some(d => lowerDomain.includes(d) || lowerDomain === d.split('.')[0] || d.startsWith(lowerDomain)) 
    || lowerDomain.includes('tempmail') 
    || lowerDomain.includes('10minutemail') 
    || lowerDomain.includes('guerrillamail') 
    || lowerDomain.includes('mailinator');

  // 4. Role-Based Email Detection
  const isRoleBased = ROLE_PREFIXES.includes(lowerLocalPart);

  // Status mapping
  if (dnsLookupFailed) {
    return {
      email,
      status: 'Unknown',
      reason: 'DNS lookup failed or timeout',
      checks: { syntax: true, mx: false, disposable: isDisposable, role: isRoleBased }
    };
  }

  if (!hasMx) {
    return {
      email,
      status: 'Invalid',
      reason: 'No MX record',
      checks: { syntax: true, mx: false, disposable: isDisposable, role: isRoleBased }
    };
  }

  if (isDisposable) {
    return {
      email,
      status: 'Risky',
      reason: 'Disposable email',
      checks: { syntax: true, mx: true, disposable: true, role: isRoleBased }
    };
  }

  if (isRoleBased) {
    return {
      email,
      status: 'Risky',
      reason: 'Role-based email',
      checks: { syntax: true, mx: true, disposable: false, role: true }
    };
  }

  return {
    email,
    status: 'Verified',
    reason: 'Valid syntax + MX record exists',
    checks: { syntax: true, mx: true, disposable: false, role: false }
  };
}

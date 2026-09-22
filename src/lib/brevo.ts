/**
 * Brevo API integration for contact management.
 * Used by /api/interest endpoint to create/update newsletter subscribers.
 */

export interface ContactFormData {
  email: string;
  name?: string;
  phone?: string;
  interest?: string | string[];
  message?: string;
}

export interface BrevoContact {
  email: string;
  attributes?: Record<string, string>;
  listIds: number[];
  updateEnabled: boolean;
}

export interface BrevoResult {
  success: boolean;
  message: string;
  status: number;
}

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';
const INTRESSEANMALNINGAR_LIST_ID = 3;

function extractFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || '';
}

function extractLastName(fullName: string): string {
  return fullName.trim().split(/\s+/).slice(1).join(' ') || '';
}

function normalizeInterests(interest: string | string[] | undefined): string {
  if (!interest) return '';
  if (Array.isArray(interest)) return interest.join(', ');
  return interest;
}

export function buildBrevoContact(data: ContactFormData): BrevoContact {
  // Only use FIRSTNAME and LASTNAME - these are default Brevo attributes.
  // Custom attributes (INTERESTS, SMS, NOTES) cause 400 errors if not defined in the account.
  const attributes: Record<string, string> = {};

  if (data.name && typeof data.name === 'string') {
    attributes.FIRSTNAME = extractFirstName(data.name);
    attributes.LASTNAME = extractLastName(data.name);
  }

  const contact: BrevoContact = {
    email: data.email.toLowerCase().trim(),
    listIds: [INTRESSEANMALNINGAR_LIST_ID],
    updateEnabled: true,
  };

  if (Object.keys(attributes).length > 0) {
    contact.attributes = attributes;
  }

  return contact;
}

export async function createOrUpdateBrevoContact(
  data: ContactFormData,
  apiKey: string
): Promise<BrevoResult> {
  const contact = buildBrevoContact(data);

  // Log full signup data server-side (interests, phone, message not sent to Brevo)
  const interests = normalizeInterests(data.interest);
  console.log(
    `[Brevo] Signup: email=${data.email}, name=${data.name || '(none)'}, ` +
    `phone=${data.phone || '(none)'}, interests=${interests || '(none)'}, ` +
    `message=${data.message ? 'yes' : 'no'}`
  );

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(contact),
    });

    const responseText = await response.text();
    console.log(`[Brevo] Response: status=${response.status}, body=${responseText}`);

    if (!response.ok) {
      // Brevo returns 400 when contact exists but updateEnabled handles it
      if (response.status === 400 && responseText.includes('Contact already exist')) {
        return { success: true, message: 'Contact updated', status: 200 };
      }

      return { success: false, message: 'Failed to create contact', status: 502 };
    }

    return { success: true, message: 'Contact created', status: 200 };
  } catch (error) {
    console.error('[Brevo] Network error:', error);
    return { success: false, message: 'Failed to reach email service', status: 502 };
  }
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  // Basic email validation - matches common patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

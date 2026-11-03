/**
 * Brevo API integration for contact management and internal notifications.
 *
 * Custom contact attributes (create in Brevo as type Text before they are stored
 * on the contact; missing attributes are stripped and the signup is retried):
 *   INTRESSE    Text  – comma-separated interest labels
 *   MEDDELANDE  Text  – optional free-text message
 *   KALLA       Text  – which page/form the signup came from
 *
 * Default attributes FIRSTNAME and LASTNAME are always sent when present.
 * Contacts are added to list 3 (Intresseanmälningar) with updateEnabled: true
 * so existing contacts are updated and the welcome automation still runs.
 */

import { formatInterestLabels, formatSourceLabel } from '../data/interest-options';

export interface ContactFormData {
  email: string;
  name?: string;
  phone?: string;
  interest?: string | string[];
  message?: string;
  source?: string;
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

export interface NotificationPayload {
  email: string;
  name: string;
  phone: string;
  interests: string;
  message: string;
  source: string;
  submittedAt: Date;
}

export const CUSTOM_BREVO_ATTRIBUTES = ['INTRESSE', 'MEDDELANDE', 'KALLA'] as const;

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_SMTP_URL = 'https://api.brevo.com/v3/smtp/email';
const INTRESSEANMALNINGAR_LIST_ID = 3;

const SENDER_EMAIL = 'hej@en-sund-varld.se';
const SENDER_NAME = 'En sund värld';
export const DEFAULT_NOTIFY_EMAIL = 'ensundvarld@gmail.com';

/** Brevo Text attributes are safest below ~1500 characters. */
export const BREVO_ATTRIBUTE_MAX = 1500;

function extractFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || '';
}

function extractLastName(fullName: string): string {
  return fullName.trim().split(/\s+/).slice(1).join(' ') || '';
}

export function normalizeInterests(interest: string | string[] | undefined): string[] {
  if (!interest) return [];
  const values = Array.isArray(interest) ? interest : [interest];
  return values
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);
}

function clip(value: string, max: number): string {
  if (value.length <= max) return value;
  return value.slice(0, max);
}

function setAttribute(attributes: Record<string, string>, key: string, value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return;
  attributes[key] = clip(trimmed, BREVO_ATTRIBUTE_MAX);
}

export function buildBrevoContact(data: ContactFormData): BrevoContact {
  // Omit empty attributes: Brevo returns 400 for empty string values.
  const attributes: Record<string, string> = {};

  if (data.name && typeof data.name === 'string') {
    const firstName = extractFirstName(data.name);
    const lastName = extractLastName(data.name);

    if (firstName) {
      attributes.FIRSTNAME = firstName;
    }
    if (lastName) {
      attributes.LASTNAME = lastName;
    }
  }

  const interestValues = normalizeInterests(data.interest);
  setAttribute(attributes, 'INTRESSE', formatInterestLabels(interestValues));
  setAttribute(attributes, 'MEDDELANDE', data.message);
  setAttribute(attributes, 'KALLA', formatSourceLabel(data.source) || data.source);

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

function customAttributeKeys(contact: BrevoContact): string[] {
  if (!contact.attributes) return [];
  return CUSTOM_BREVO_ATTRIBUTES.filter((key) => key in contact.attributes!);
}

export function attributesToStripFromError(errorBody: string, sentKeys: string[]): string[] {
  if (sentKeys.length === 0) return [];

  const mentioned = sentKeys.filter((key) => new RegExp(`\\b${key}\\b`).test(errorBody));
  if (mentioned.length > 0) return mentioned;

  if (
    /invalid_parameter/i.test(errorBody) ||
    /invalid attributes/i.test(errorBody) ||
    /does not exist/i.test(errorBody) ||
    /unknown attribute/i.test(errorBody) ||
    /attribute.*not (found|defined)/i.test(errorBody)
  ) {
    return sentKeys;
  }

  return [];
}

export function stripAttributes(contact: BrevoContact, keys: string[]): BrevoContact {
  if (!contact.attributes || keys.length === 0) return contact;

  const attributes = { ...contact.attributes };
  for (const key of keys) {
    delete attributes[key];
  }

  const next: BrevoContact = {
    email: contact.email,
    listIds: contact.listIds,
    updateEnabled: contact.updateEnabled,
  };

  if (Object.keys(attributes).length > 0) {
    next.attributes = attributes;
  }

  return next;
}

function isDuplicateContactError(status: number, body: string, code: string): boolean {
  return (
    status === 400 &&
    (body.includes('Contact already exist') ||
      body.includes('duplicate_parameter') ||
      code === 'duplicate_parameter')
  );
}

async function postBrevoContact(
  contact: BrevoContact,
  apiKey: string
): Promise<{ result: BrevoResult; body: string; rawStatus: number }> {
  const response = await fetch(BREVO_CONTACTS_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(contact),
  });

  const body = await response.text();
  console.log(`[Brevo] Response: status=${response.status}, body=${body}`);

  if (response.status === 201) {
    return { result: { success: true, message: 'Contact created', status: 201 }, body, rawStatus: 201 };
  }

  if (response.status === 204) {
    return { result: { success: true, message: 'Contact updated', status: 200 }, body, rawStatus: 204 };
  }

  let errorCode = '';
  try {
    errorCode = JSON.parse(body).code || '';
  } catch {
    // Response might not be JSON
  }

  if (isDuplicateContactError(response.status, body, errorCode)) {
    console.log('[Brevo] Contact exists, treating as success');
    return {
      result: { success: true, message: 'Contact already exists', status: 200 },
      body,
      rawStatus: response.status,
    };
  }

  if (response.status === 401) {
    console.error('[Brevo] Authentication failed - check BREVO_API_KEY');
    return {
      result: { success: false, message: 'Email service authentication failed', status: 500 },
      body,
      rawStatus: 401,
    };
  }

  if (response.status === 429) {
    console.error('[Brevo] Rate limited');
    return {
      result: { success: false, message: 'Too many requests - try again later', status: 429 },
      body,
      rawStatus: 429,
    };
  }

  if (!response.ok) {
    console.error(`[Brevo] Failed: status=${response.status}, code=${errorCode}, body=${body}`);
    return {
      result: { success: false, message: 'Failed to create contact', status: 502 },
      body,
      rawStatus: response.status,
    };
  }

  return {
    result: { success: true, message: 'Contact processed', status: 200 },
    body,
    rawStatus: response.status,
  };
}

export async function createOrUpdateBrevoContact(
  data: ContactFormData,
  apiKey: string
): Promise<BrevoResult> {
  let contact = buildBrevoContact(data);

  const interests = formatInterestLabels(normalizeInterests(data.interest));
  console.log(
    `[Brevo] Signup: email=${data.email}, name=${data.name || '(none)'}, ` +
      `phone=${data.phone || '(none)'}, interests=${interests || '(none)'}, ` +
      `message=${data.message ? 'yes' : 'no'}, source=${data.source || '(none)'}`
  );

  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { result, body, rawStatus } = await postBrevoContact(contact, apiKey);
      if (result.success) return result;

      const sentCustom = customAttributeKeys(contact);
      if (rawStatus !== 400 || sentCustom.length === 0) {
        return result;
      }

      const toStrip = attributesToStripFromError(body, sentCustom);
      if (toStrip.length === 0) {
        return result;
      }

      console.warn(`[Brevo] Retrying without attributes: ${toStrip.join(', ')}`);
      contact = stripAttributes(contact, toStrip);
    }

    return { success: false, message: 'Failed to create contact', status: 502 };
  } catch (error) {
    console.error('[Brevo] Network error:', error);
    return { success: false, message: 'Failed to reach email service', status: 502 };
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

function displayOrFallback(value: string, fallback = 'Ej angivet'): string {
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function buildNotificationEmail(payload: NotificationPayload): {
  subject: string;
  htmlContent: string;
  textContent: string;
} {
  const name = displayOrFallback(payload.name);
  const interests = displayOrFallback(payload.interests);
  const message = displayOrFallback(payload.message);
  const source = displayOrFallback(payload.source);
  const phone = displayOrFallback(payload.phone);
  const when = formatSubmittedAt(payload.submittedAt);
  const who = payload.name.trim() || payload.email;

  const subject = `Ny intresseanmälan från ${who}`;

  const rows: Array<[string, string]> = [
    ['Namn', name],
    ['E-post', payload.email],
    ['Telefon', phone],
    ['Intresse', interests],
    ['Meddelande', message],
    ['Källa', source],
    ['Tidpunkt', when],
  ];

  const htmlRows = rows
    .map(([label, value]) => {
      const formatted = escapeHtml(value).replace(/\r\n|\r|\n/g, '<br>');
      return `<tr>
        <th align="left" valign="top" style="padding:8px 12px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1d3a37;white-space:nowrap;">${escapeHtml(label)}</th>
        <td valign="top" style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1a2624;">${formatted}</td>
      </tr>`;
    })
    .join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#f5f4f0;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f5f4f0;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e1d6;">
          <tr>
            <td style="background-color:#1d3a37;padding:20px 24px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#ffffff;">Ny intresseanmälan</p>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#adcdc8;">En sund värld</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1a2624;">
                Någon har fyllt i intresseformuläret på en-sund-varld.se. Svara gärna direkt till personen (svara-till är satt till hens e-post).
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                ${htmlRows}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textContent = [
    'Ny intresseanmälan',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Detta mejl skickades automatiskt från en-sund-varld.se.',
  ].join('\n');

  return { subject, htmlContent, textContent };
}

export function parseNotifyEmails(raw: string | undefined): string[] {
  const value = (raw ?? '').trim() || DEFAULT_NOTIFY_EMAIL;
  return [...new Set(value.split(/[,;]/).map((part) => part.trim()).filter(isValidEmail))];
}

export async function sendInterestNotification(
  payload: NotificationPayload,
  apiKey: string,
  notifyEmail: string | undefined
): Promise<BrevoResult> {
  const recipients = parseNotifyEmails(notifyEmail);
  if (recipients.length === 0) {
    console.error('[Brevo] No valid NOTIFY_EMAIL recipients');
    return { success: false, message: 'No valid notification recipients', status: 500 };
  }

  const { subject, htmlContent, textContent } = buildNotificationEmail(payload);

  const body: Record<string, unknown> = {
    sender: { name: SENDER_NAME, email: SENDER_EMAIL },
    to: recipients.map((email) => ({ email })),
    subject,
    htmlContent,
    textContent,
  };

  if (isValidEmail(payload.email)) {
    body.replyTo = {
      email: payload.email.toLowerCase().trim(),
      ...(payload.name.trim() ? { name: payload.name.trim() } : {}),
    };
  }

  try {
    const response = await fetch(BREVO_SMTP_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log(`[Brevo] Notification: status=${response.status}, body=${responseText}`);

    if (!response.ok) {
      console.error(`[Brevo] Notification failed: status=${response.status}, body=${responseText}`);
      return { success: false, message: 'Failed to send notification', status: 502 };
    }

    return { success: true, message: 'Notification sent', status: 200 };
  } catch (error) {
    console.error('[Brevo] Notification network error:', error);
    return { success: false, message: 'Failed to send notification', status: 502 };
  }
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

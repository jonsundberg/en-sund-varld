import type { APIRoute } from 'astro';
import {
  createOrUpdateBrevoContact,
  isValidEmail,
  type ContactFormData,
} from '../../lib/brevo';

export const prerender = false;

interface FormPayload {
  email?: string;
  name?: string;
  phone?: string;
  interest?: string | string[];
  message?: string;
  _gotcha?: string; // Honeypot field
}

async function parseFormBody(request: Request): Promise<FormPayload> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return (await request.json()) as FormPayload;
  }

  // Handle form-urlencoded (standard form POST)
  const formData = await request.formData();
  const payload: FormPayload = {};

  for (const [key, value] of formData.entries()) {
    if (key === 'interest') {
      // Collect all interest checkboxes into an array
      if (!payload.interest) {
        payload.interest = [];
      }
      (payload.interest as string[]).push(value.toString());
    } else {
      (payload as Record<string, string>)[key] = value.toString();
    }
  }

  return payload;
}

export const POST: APIRoute = async ({ request }) => {
  let payload: FormPayload;

  try {
    payload = await parseFormBody(request);
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Ogiltigt formulärdata' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Honeypot check – bots often fill hidden fields
  if (payload._gotcha) {
    // Silently accept to not reveal honeypot to bots
    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate required email field
  if (!payload.email || !isValidEmail(payload.email)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Ogiltig e-postadress' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate at least one interest is selected
  const interests = payload.interest;
  const hasInterest =
    (Array.isArray(interests) && interests.length > 0) ||
    (typeof interests === 'string' && interests.trim().length > 0);

  if (!hasInterest) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Välj minst ett intresseområde' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Get Brevo API key from environment (process.env for Vercel serverless)
  const brevoApiKey = process.env.BREVO_API_KEY ?? import.meta.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.error('BREVO_API_KEY environment variable is not set');
    return new Response(
      JSON.stringify({ ok: false, error: 'Serverfel – försök igen senare' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Build contact data and send to Brevo
  const contactData: ContactFormData = {
    email: payload.email,
    name: payload.name,
    phone: payload.phone,
    interest: payload.interest,
    message: payload.message,
  };

  const result = await createOrUpdateBrevoContact(contactData, brevoApiKey);

  if (!result.success) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Kunde inte spara din anmälan – försök igen' }),
      { status: result.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, message: result.message }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

// Reject other HTTP methods
export const ALL: APIRoute = () => {
  return new Response(
    JSON.stringify({ ok: false, error: 'Metoden stöds ej' }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'POST',
      },
    }
  );
};

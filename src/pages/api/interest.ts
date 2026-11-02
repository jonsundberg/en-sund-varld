import type { APIRoute } from 'astro';
import {
  createOrUpdateBrevoContact,
  isValidEmail,
  sendInterestNotification,
} from '../../lib/brevo';
import {
  describeSignup,
  parseFormPayload,
  sanitizeFormPayload,
  type FormPayload,
} from '../../lib/interest-payload';

export const prerender = false;

async function parseFormBody(request: Request): Promise<FormPayload> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return (await request.json()) as FormPayload;
  }

  return parseFormPayload(await request.formData());
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: FormPayload;

  try {
    payload = await parseFormBody(request);
  } catch {
    return json({ ok: false, error: 'Ogiltigt formulärdata' }, 400);
  }

  // Honeypot check – bots often fill hidden fields
  if (payload._gotcha) {
    return json({ ok: true }, 200);
  }

  const contactData = sanitizeFormPayload(payload, request.headers.get('referer'));

  if (!contactData.email || !isValidEmail(contactData.email)) {
    return json({ ok: false, error: 'Ogiltig e-postadress' }, 400);
  }

  const interests = contactData.interest;
  const hasInterest = Array.isArray(interests) && interests.length > 0;

  if (!hasInterest) {
    return json({ ok: false, error: 'Välj minst ett intresseområde' }, 400);
  }

  const brevoApiKey = process.env.BREVO_API_KEY ?? import.meta.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.error('BREVO_API_KEY environment variable is not set');
    return json({ ok: false, error: 'Serverfel – försök igen senare' }, 500);
  }

  const result = await createOrUpdateBrevoContact(contactData, brevoApiKey);

  if (!result.success) {
    let userMessage = 'Kunde inte spara din anmälan – försök igen';

    if (result.status === 429) {
      userMessage = 'För många förfrågningar just nu – vänta en stund och försök igen';
    } else if (result.status === 500) {
      userMessage = 'Serverfel – vi undersöker problemet';
    }

    console.error(`[Interest API] Brevo failed: ${result.message} (status ${result.status})`);

    return json({ ok: false, error: userMessage }, result.status);
  }

  const { interests: interestLabels, source } = describeSignup(contactData);
  const notifyEmail = process.env.NOTIFY_EMAIL ?? import.meta.env.NOTIFY_EMAIL;

  try {
    const notifyResult = await sendInterestNotification(
      {
        email: contactData.email,
        name: contactData.name || '',
        phone: contactData.phone || '',
        interests: interestLabels,
        message: contactData.message || '',
        source,
        submittedAt: new Date(),
      },
      brevoApiKey,
      notifyEmail
    );

    if (!notifyResult.success) {
      console.error(`[Interest API] Notification failed: ${notifyResult.message}`);
    }
  } catch (error) {
    console.error('[Interest API] Notification threw:', error);
  }

  return json({ ok: true, message: result.message }, 200);
};

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

import type { APIRoute } from 'astro';

export const prerender = false;

interface FormspreePayload {
  email?: string;
  name?: string;
  phone?: string;
  interest?: string | string[];
  message?: string;
  _gotcha?: string;
}

interface BrevoContact {
  email: string;
  attributes?: Record<string, string>;
  listIds: number[];
  updateEnabled: boolean;
}

function parseFormspreePayload(body: unknown): FormspreePayload {
  if (!body || typeof body !== 'object') {
    return {};
  }

  const obj = body as Record<string, unknown>;
  
  if ('data' in obj && typeof obj.data === 'object' && obj.data !== null) {
    return obj.data as FormspreePayload;
  }
  
  return obj as FormspreePayload;
}

function extractFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || '';
}

function normalizeInterests(interest: string | string[] | undefined): string {
  if (!interest) return '';
  if (Array.isArray(interest)) return interest.join(', ');
  return interest;
}

export const POST: APIRoute = async ({ request }) => {
  const secretHeader = request.headers.get('x-formspree-webhook-secret');
  const secretQuery = new URL(request.url).searchParams.get('secret');
  const expectedSecret = import.meta.env.FORMSPREE_WEBHOOK_SECRET;
  
  if (expectedSecret) {
    const providedSecret = secretHeader || secretQuery;
    if (providedSecret !== expectedSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = parseFormspreePayload(body);

  if (payload._gotcha) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!payload.email || typeof payload.email !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing required field: email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const brevoApiKey = import.meta.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.error('BREVO_API_KEY environment variable is not set');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const attributes: Record<string, string> = {};
  
  if (payload.name && typeof payload.name === 'string') {
    attributes.FIRSTNAME = extractFirstName(payload.name);
    attributes.LASTNAME = payload.name.trim().split(/\s+/).slice(1).join(' ') || '';
  }
  
  if (payload.phone && typeof payload.phone === 'string') {
    attributes.SMS = payload.phone.replace(/\s+/g, '');
  }
  
  const interests = normalizeInterests(payload.interest);
  if (interests) {
    attributes.INTERESTS = interests;
  }

  const brevoContact: BrevoContact = {
    email: payload.email.toLowerCase().trim(),
    listIds: [3],
    updateEnabled: true,
  };
  
  if (Object.keys(attributes).length > 0) {
    brevoContact.attributes = attributes;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(brevoContact),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo API error:', response.status, errorText);
      
      if (response.status === 400 && errorText.includes('Contact already exist')) {
        return new Response(JSON.stringify({ ok: true, message: 'Contact updated' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'Failed to create contact' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, message: 'Contact created' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling Brevo API:', error);
    return new Response(JSON.stringify({ error: 'Failed to reach email service' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const ALL: APIRoute = () => {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 
      'Content-Type': 'application/json',
      'Allow': 'POST',
    },
  });
};

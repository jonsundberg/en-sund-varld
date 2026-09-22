# Formspree → Brevo Bridge

This document describes how the interest form (Intresseanmälan) submissions flow from Formspree to Brevo for automated welcome emails.

## Overview

When someone submits the interest form:
1. Formspree receives and stores the submission
2. Formspree sends a webhook to our Vercel serverless endpoint
3. The endpoint creates/updates the contact in Brevo list **Intresseanmälningar** (list id 3)
4. Brevo's existing automation **«Welcome message»** triggers and sends the welcome email

## Setup Instructions

### 1. Set Environment Variable in Vercel

In Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `BREVO_API_KEY` | Your Brevo API key (v3) | Production (and Preview if needed) |

Get the API key from [Brevo → SMTP & API → API Keys](https://app.brevo.com/settings/keys/api).

### 2. Configure Formspree Webhook

In Formspree Dashboard → Form `xbgjrqlz` → Actions → Webhooks:

**Webhook URL:**
```
https://en-sund-varld.se/api/formspree-webhook
```

Replace `en-sund-varld.se` with your actual production domain if different.

### 3. (Optional) Webhook Secret

For extra security, you can add a shared secret:

1. Add `FORMSPREE_WEBHOOK_SECRET` in Vercel env vars with a random string
2. Append `?secret=YOUR_SECRET` to the webhook URL in Formspree, or configure Formspree to send header `x-formspree-webhook-secret`

This is optional but recommended for production.

## Technical Details

### Endpoint Path

```
POST /api/formspree-webhook
```

### Brevo Contact Mapping

| Form Field | Brevo Attribute |
|------------|-----------------|
| `email` | Contact email (required) |
| `name` | `FIRSTNAME` (first word), `LASTNAME` (rest) |
| `phone` | `SMS` |
| `interest` | `INTERESTS` (comma-separated) |

All contacts are added to **list id 3** (Intresseanmälningar).

### Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success (contact created or updated) |
| 400 | Missing email or invalid JSON |
| 401 | Invalid webhook secret (if configured) |
| 405 | Method not allowed (only POST accepted) |
| 500 | Server config error (missing `BREVO_API_KEY`) |
| 502 | Failed to reach Brevo API |

### Honeypot Handling

If the `_gotcha` field is filled (bot submission), the endpoint returns 200 silently without creating a contact.

## Testing

### Local Testing with curl

```bash
curl -X POST http://localhost:4321/api/formspree-webhook \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","interest":["ekoby-boendegemenskap"]}'
```

Note: Local testing requires `BREVO_API_KEY` set in `.env` (not committed).

### Testing on Vercel Preview

1. Push to a branch with a PR
2. Vercel creates a preview deployment
3. Test with the preview URL: `https://<preview-url>/api/formspree-webhook`

### Verify in Brevo

After a successful submission:
1. Go to Brevo → Contacts → Lists → Intresseanmälningar
2. The new contact should appear with the mapped attributes

## Troubleshooting

**Error: "Server configuration error"**
- Check that `BREVO_API_KEY` is set in Vercel environment variables

**Error: "Failed to create contact"**
- Check Vercel function logs for detailed Brevo API response
- Verify the API key has permission to create contacts

**Webhook not triggering**
- Verify the webhook URL is correct in Formspree settings
- Check that the form submission completed successfully in Formspree dashboard

## Architecture Notes

- Uses `@astrojs/vercel` adapter with `output: 'hybrid'`
- All pages remain statically generated (SSG)
- Only the `/api/formspree-webhook` endpoint runs as a serverless function
- No API keys are stored in the repository

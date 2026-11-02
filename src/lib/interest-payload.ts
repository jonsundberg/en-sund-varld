import {
  formatInterestLabels,
  formatSourceLabel,
  INTEREST_VALUE_SET,
} from '../data/interest-options';
import type { ContactFormData } from './brevo';

export const MAX_NAME_LENGTH = 120;
export const MAX_PHONE_LENGTH = 40;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_SOURCE_LENGTH = 200;
export const MAX_INTERESTS = 12;

export interface FormPayload {
  email?: string;
  name?: string;
  phone?: string;
  interest?: string | string[];
  message?: string;
  source?: string;
  kalla?: string;
  _gotcha?: string;
}

function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

export function sanitizeText(value: string | undefined, max: number): string {
  if (!value || typeof value !== 'string') return '';
  return stripControlChars(value).trim().slice(0, max);
}

export function sanitizeInterestValues(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  const values = Array.isArray(raw) ? raw : [raw];
  const unique: string[] = [];

  for (const value of values) {
    const parts = String(value).split(',');
    for (const part of parts) {
      const trimmed = stripControlChars(part).trim();
      if (!INTEREST_VALUE_SET.has(trimmed)) continue;
      if (!unique.includes(trimmed)) unique.push(trimmed);
      if (unique.length >= MAX_INTERESTS) return unique;
    }
  }

  return unique;
}

export function parseFormPayload(formData: FormData): FormPayload {
  const payload: FormPayload = {};

  for (const [key, value] of formData.entries()) {
    if (key === 'interest') {
      if (!payload.interest) payload.interest = [];
      (payload.interest as string[]).push(value.toString());
    } else if (key in payload || ['email', 'name', 'phone', 'message', 'source', 'kalla', '_gotcha'].includes(key)) {
      (payload as Record<string, string>)[key] = value.toString();
    }
  }

  return payload;
}

export function sanitizeFormPayload(
  payload: FormPayload,
  referer?: string | null
): ContactFormData {
  const interests = sanitizeInterestValues(payload.interest);
  const sourceRaw =
    sanitizeText(payload.source, MAX_SOURCE_LENGTH) ||
    sanitizeText(payload.kalla, MAX_SOURCE_LENGTH) ||
    sanitizeText(referer ?? undefined, MAX_SOURCE_LENGTH);

  return {
    email: sanitizeText(payload.email, 254).toLowerCase(),
    name: sanitizeText(payload.name, MAX_NAME_LENGTH),
    phone: sanitizeText(payload.phone, MAX_PHONE_LENGTH),
    interest: interests,
    message: sanitizeText(payload.message, MAX_MESSAGE_LENGTH),
    source: formatSourceLabel(sourceRaw) || sourceRaw,
  };
}

export function describeSignup(data: ContactFormData): {
  interests: string;
  source: string;
} {
  const values = Array.isArray(data.interest)
    ? data.interest
    : data.interest
      ? [data.interest]
      : [];

  return {
    interests: formatInterestLabels(values),
    source: data.source?.trim() || '',
  };
}

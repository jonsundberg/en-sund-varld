/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly BREVO_API_KEY?: string;
  readonly NOTIFY_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

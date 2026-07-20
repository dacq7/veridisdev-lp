// PROVISIONING: requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
// NEXT_PUBLIC_SANITY_API_VERSION in environment variables.
// All exports degrade gracefully when env vars are absent — no runtime errors.

import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

const PROJECT_ID  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET     = process.env.NEXT_PUBLIC_SANITY_DATASET     ?? 'production';
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01';

export function isSanityConfigured(): boolean {
  return Boolean(PROJECT_ID && DATASET);
}

let _client: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) return null;
  if (!_client) {
    _client = createClient({
      projectId:   PROJECT_ID!,
      dataset:     DATASET,
      apiVersion:  API_VERSION,
      useCdn:      true,
      perspective: 'published',
    });
  }
  return _client;
}

let _builder: ReturnType<typeof imageUrlBuilder> | null = null;

export function urlForImage(source: SanityImageSource): string | null {
  if (!isSanityConfigured()) return null;
  if (!_builder) {
    const client = getSanityClient();
    if (!client) return null;
    _builder = imageUrlBuilder(client);
  }
  return _builder.image(source).auto('format').fit('max').url();
}

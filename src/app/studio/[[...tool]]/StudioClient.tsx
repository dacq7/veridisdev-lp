'use client';
// PROVISIONING: Only rendered when Sanity env vars are present.

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function StudioClient() {
  return <NextStudio config={config} />;
}

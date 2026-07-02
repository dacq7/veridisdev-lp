import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

const sentryEnabled = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

const intlConfig = withNextIntl(nextConfig);

export default sentryEnabled
  ? withSentryConfig(intlConfig, {
      // Source maps upload — only works when SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT are set
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      // Upload wider set of source maps for better stack traces
      widenClientFileUpload: true,
      // Tunnel Sentry requests to circumvent ad-blockers (disabled — causes 404s in Next.js 16)
      // tunnelRoute: '/monitoring',
      // Remove Sentry logger statements from bundle
      disableLogger: true,
      // Source maps are deleted after upload
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
    })
  : intlConfig;

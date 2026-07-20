// These credentials are intentionally NEXT_PUBLIC_* — visible in the client
// bundle by design. They are fake accounts created for portfolio demos, not
// real user secrets. Rotating them requires only an env var update; no code change.
export const DEMO_CREDENTIALS = {
  budokan: {
    sensei:   { user: process.env.NEXT_PUBLIC_DEMO_BUDOKAN_USER ?? '',          pass: process.env.NEXT_PUBLIC_DEMO_BUDOKAN_PASS ?? '' },
    karateca: { user: process.env.NEXT_PUBLIC_DEMO_BUDOKAN_KARATECA_USER ?? '', pass: process.env.NEXT_PUBLIC_DEMO_BUDOKAN_KARATECA_PASS ?? '' },
  },
  barberos: {
    admin: { user: process.env.NEXT_PUBLIC_DEMO_BARBEROS_ADMIN_USER ?? '', pass: process.env.NEXT_PUBLIC_DEMO_BARBEROS_ADMIN_PASS ?? '' },
    staff: { user: process.env.NEXT_PUBLIC_DEMO_BARBEROS_STAFF_USER ?? '', pass: process.env.NEXT_PUBLIC_DEMO_BARBEROS_STAFF_PASS ?? '' },
  },
  trucking: {
    admin:  { user: process.env.NEXT_PUBLIC_DEMO_TRUCKING_ADMIN_USER ?? '',  pass: process.env.NEXT_PUBLIC_DEMO_TRUCKING_ADMIN_PASS ?? '' },
    vendor: { user: process.env.NEXT_PUBLIC_DEMO_TRUCKING_VENDOR_USER ?? '', pass: process.env.NEXT_PUBLIC_DEMO_TRUCKING_VENDOR_PASS ?? '' },
  },
} as const;

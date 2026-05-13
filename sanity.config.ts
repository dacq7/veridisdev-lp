// Sanity Studio configuration.
// PROVISIONING: Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET
// before opening /studio. Without them the studio renders a placeholder.

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes }   from './sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder';
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET     ?? 'production';

export default defineConfig({
  basePath:  '/studio',
  projectId,
  dataset,
  title: 'Veridis Dev CMS',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});

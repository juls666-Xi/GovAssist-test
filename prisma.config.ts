import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // This forces the CLI to use your direct port (5432) so migrations don't freeze
    url: env('DIRECT_URL'),
  },
});
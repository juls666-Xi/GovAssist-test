import { defineConfig } from '@prisma/config';

// Explicitly load the .env file so process.env isn't empty
process.loadEnvFile();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
});
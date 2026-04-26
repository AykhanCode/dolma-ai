import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || 'dolma',
  password: process.env.DATABASE_PASSWORD || 'dolma_password',
  name: process.env.DATABASE_NAME || 'dolma_ai',
  ssl: process.env.DATABASE_SSL === 'true',
}));

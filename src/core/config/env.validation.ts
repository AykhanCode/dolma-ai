import * as Joi from 'joi';

export function validateEnv(config: Record<string, unknown>) {
  const schema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    API_PREFIX: Joi.string().default('api/v1'),
    DATABASE_HOST: Joi.string().default('localhost'),
    DATABASE_PORT: Joi.number().default(5432),
    DATABASE_USERNAME: Joi.string().default('dolma'),
    DATABASE_PASSWORD: Joi.string().default('dolma_password'),
    DATABASE_NAME: Joi.string().default('dolma_ai'),
    DATABASE_SSL: Joi.string().valid('true', 'false').default('false'),
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string().allow('').default(''),
    JWT_SECRET: Joi.string().default('changeme-secret'),
    JWT_EXPIRES_IN: Joi.string().default('15m'),
    JWT_REFRESH_SECRET: Joi.string().default('changeme-refresh-secret'),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
    AWS_ACCESS_KEY_ID: Joi.string().allow('').default(''),
    AWS_SECRET_ACCESS_KEY: Joi.string().allow('').default(''),
    AWS_REGION: Joi.string().default('us-east-1'),
    AWS_S3_BUCKET: Joi.string().default('dolma-ai-storage'),
    CLAUDE_API_KEY: Joi.string().allow('').default(''),
    WHATSAPP_VERIFY_TOKEN: Joi.string().allow('').default(''),
    WHATSAPP_APP_SECRET: Joi.string().allow('').default(''),
    INSTAGRAM_VERIFY_TOKEN: Joi.string().allow('').default(''),
    INSTAGRAM_APP_SECRET: Joi.string().allow('').default(''),
    TIKTOK_VERIFY_TOKEN: Joi.string().allow('').default(''),
    TIKTOK_APP_SECRET: Joi.string().allow('').default(''),
    THROTTLE_TTL: Joi.number().default(60),
    THROTTLE_LIMIT: Joi.number().default(100),
    CORS_ORIGINS: Joi.string().default('http://localhost:3000'),
  }).unknown(true);

  const { error, value } = schema.validate(config, { abortEarly: false });
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return value;
}

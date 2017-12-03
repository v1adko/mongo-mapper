export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTesting: process.env.NODE_ENV === 'test'
};

export const connectionString =
  process.env.CONNECTION_STRING || 'mongodb://localhost:27017/test-db';

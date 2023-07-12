export const baseConfig = {
  // Application",
  APP_NAME: "Unisolve-APIs",
  APP_VERSION: "1.0.0",
  API_VERSION: "1",
  APP_PORT: 3002,
  APP_HOST: "127.0.0.1",
  APP_HOST_NAME: "localhost",

  // Log",
  LOG_LEVEL: "debug",

  // Database",
  DB_TARGET: "local",
  DB_CLIENT: "mysql",
  DB_PORT: 3306,
  DB_HOST: "localhost",
  DB_USER: "root",
  DB_PASSWORD: "",
  DB_NAME: "unisolve_db_v1",
  DB_MIGRATE_FORCE: "true",
  DB_MIGRATE_ALTER: "false",

  // Sentry",
  // https: "//docs.sentry.io/quickstart",
  SENTRY_DSN: "",

  // JWT Keys",
  PRIVATE_KEY: "keys/jwtRS256.pem",
  PUBLIC_KEY: "keys/jwtRS256.pem",
  TOKEN_DEFAULT_TIMEOUT: "3d",
  SALT: "$2a$10$iXP5unZT6syNFAlPYvzoPu",


  // PUSH NOTIFICATIONS",
  PUSH_NOTIFICATIONS_PUBLIC_KEY: "BMTSBIYkA0LuG8871kFh6C77c7S4U1bGMzus7MWXT10uCBj3qmrK0lpJXdcBqdHi2qEhkmsnuDc74_rc5fcrFSE",
  PUSH_NOTIFICATIONS_PRIVATE_KEY: "dK35qhoxez8ke_rVFHOURNLhk21ogRsEav6gHEMalj0",
  PUSH_NOTIFICATIONS_EMAIL: "harishkumar@inqui-lab.org",

  // RabitMQ",
  RABBITMQ_URL: "amqp://guest:guest@localhost:5672",
  RABBITMQ_QUEUE: "unisolve-api-queue",
  RaBBITMQ_QUEUE_DURABLE: "true",


  // Serving static files",
  SERVE_STATIC_FILES: "true",
  SHOW_ROUTES: "true",
  STREAM_INTERVAL: "1000", // in milliseconds 1000 = 1 second",

  EMAIL_USER: "harishkumar@inqui-lab.org",
  EMAIL_PASSWORD: ""
};
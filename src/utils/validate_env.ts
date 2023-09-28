import { cleanEnv, str, port} from "envalid"; 
import { baseConfig } from "../configs/base.config";

/**
 * validates the env variables with the help envValid 
 */
export default function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ["development", "production", "test"],
        }),
        APP_NAME: str({
            default: baseConfig.APP_NAME,
        }),
        APP_VERSION: str({
            default: baseConfig.APP_VERSION,
        }),
        API_VERSION: str({
            default: baseConfig.API_VERSION,
        }),
        APP_PORT:port({
            default: baseConfig.APP_PORT,
        }),
        APP_HOST: str({
            default: baseConfig.APP_HOST,
        }),
        APP_HOST_NAME: str({
            default: baseConfig.APP_HOST_NAME,
        }),

        LOG_LEVEL: str({
            choices: ["debug", "info", "warn", "error"],
            default: baseConfig.LOG_LEVEL,
        }),

        DB_TARGET: str({
            choices: ["local", "remote", "AWSDynamoDB", "AzureCosmoseDB"],
            default: baseConfig.DB_TARGET,
        }),
        DB_CLIENT: str({
            choices: ["mysql", "postgres", "mariadb", "mssql"],
            default: baseConfig.DB_CLIENT,
        }),
        DB_PORT: port({
            default: baseConfig.DB_PORT,
        }),
        DB_HOST: str({
            default: baseConfig.DB_HOST,
        }),
        DB_USER: str({
            default: baseConfig.DB_USER,
        }),
        DB_PASSWORD: str({
            default: baseConfig.DB_PASSWORD,
        }),
        DB_NAME: str({
            default: baseConfig.DB_NAME,
        }),

        SENTRY_DSN: str({
            default: baseConfig.SENTRY_DSN,
        }),

        PRIVATE_KEY: str({
            default: baseConfig.PRIVATE_KEY,
        }),
        PUBLIC_KEY: str({
            default: baseConfig.PUBLIC_KEY,
        }),
        SALT: str({
            default: baseConfig.SALT,
        }),
        TOKEN_DEFAULT_TIMEOUT: str({
            default: baseConfig.TOKEN_DEFAULT_TIMEOUT,
        }),

        SERVE_STATIC_FILES: str({
            choices: ["true", "false"],
            default: baseConfig.SERVE_STATIC_FILES,
        }),

        SHOW_ROUTES: str({
            choices: ["true", "false"],
            default: baseConfig.SHOW_ROUTES,
        }),

        PUSH_NOTIFICATIONS_PUBLIC_KEY: str({
            default: baseConfig.PUSH_NOTIFICATIONS_PUBLIC_KEY,
        }),
        PUSH_NOTIFICATIONS_PRIVATE_KEY: str({
            default: baseConfig.PUSH_NOTIFICATIONS_PRIVATE_KEY,
        }),
        PUSH_NOTIFICATIONS_EMAIL: str({
            default: baseConfig.PUSH_NOTIFICATIONS_EMAIL,
        }),

        // RabitMQ",
        RABBITMQ_URL: str({
            default: baseConfig.RABBITMQ_URL,
        }),
        RABBITMQ_QUEUE: str({
            default: baseConfig.RABBITMQ_QUEUE,
        }),
        RaBBITMQ_QUEUE_DURABLE: str({
            choices: ["true", "false"],
            default: baseConfig.RaBBITMQ_QUEUE_DURABLE,
        }),
    });
}
const path = require('path');
const { createLogger, transports, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

let logger: any = null

// setting up differ logger for different env's
if (process.env.NODE_ENV === 'development' || 'test') {
    logger = buildDevLogger(); 
} else logger = buildProdLogger();

// logger are displayed in node console for development and testing env's 
function buildDevLogger() {
    return createLogger({
        format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            format.printf(
                (info: any) => `${info.timestamp} ${info.level}: ${info.message}`
            )
        ),
        transports: [new transports.Console()],
    });
}

// logger are displayed in generated file for production env 
function buildProdLogger() {
    return createLogger({
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            format.json()
        ),
        transports: [
            new DailyRotateFile({
                filename: path.join(__dirname, '..', 'logs/all-logs-%DATE%.log'),
                json: false,
                maxSize: 5242880,
                maxFiles: 5,
            }),
            new transports.Console(),
        ],
    });
}

export default logger;
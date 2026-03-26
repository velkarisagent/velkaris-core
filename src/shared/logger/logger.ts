import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'velkaris-core' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) =>
          `${info.timestamp} [${info.level}]: ${info.message} ${
            Object.keys(info).length > 3
              ? JSON.stringify(Object.fromEntries(Object.entries(info as Record<string, unknown>).filter(([k]) => !['timestamp', 'level', 'message'].includes(k))), null, 2)
              : ''
          }`,
        ),
      ),
    }),
  ],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  );
}

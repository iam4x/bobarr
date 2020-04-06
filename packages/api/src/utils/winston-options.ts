import winston from 'winston';

function formatLog(log: Record<string, any>) {
  const { timestamp, level, context, message, ...rest } = log;
  const baseLine = `${timestamp} [${level}] ${context} - ${message}`;
  return Object.keys(rest).length > 0
    ? `${baseLine} - ${JSON.stringify(rest)}`
    : baseLine;
}

export const winstonOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.colorize(),
        winston.format.printf(formatLog)
      ),
    }),
  ],
};

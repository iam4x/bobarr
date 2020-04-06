import winston from 'winston';

function formatLog(log: Record<string, any>) {
  const { timestamp, level, context, message, ...rest } = log;
  const baseLine = `${timestamp} [${level}] ${context} - ${message}`;
  return Object.keys(rest).length > 0
    ? `${baseLine} - ${JSON.stringify(rest)}`
    : baseLine;
}

const transports: any[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.colorize(),
      winston.format.printf(formatLog)
    ),
  }),
];

if (process.env.ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'out.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.json()
      ),
    })
  );
  transports.push(
    new winston.transports.File({
      level: 'error',
      filename: 'error.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.json()
      ),
    })
  );
}

export const winstonOptions = { transports };

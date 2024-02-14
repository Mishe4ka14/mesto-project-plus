import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';
import path from 'path';

const logsDir = path.join(__dirname, '../../logs');
const errTransport = new winston.transports.DailyRotateFile({
  dirname: logsDir,
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '3d',
});

const reqTransport = new winston.transports.DailyRotateFile({
  dirname: logsDir,
  filename: 'request-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '3d',
});

export const requestLogger = expressWinston.logger({
  transports: [
    reqTransport,
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    errTransport,
  ],
  format: winston.format.json(),
});

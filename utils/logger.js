const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
// if (process.env.NODE_ENV !== 'production') {
logger.add(new winston.transports.Console({
    format: winston.format.simple()
}));
// }
/* Disable logging when running unit tests */
if (process.env.NODE_ENV === 'test') {
    logger.silent = true;
}

module.exports = logger;
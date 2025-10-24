const logWithContext = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const payload = meta ? { ...meta } : undefined;
  // eslint-disable-next-line no-console
  console[level](`[${timestamp}] ${message}`, payload || '');
};

const logInfo = (message, meta) => logWithContext('log', message, meta);
const logWarn = (message, meta) => logWithContext('warn', message, meta);
const logError = (message, error) => {
  const meta = error
    ? {
        error: error.message,
        stack: error.stack,
      }
    : undefined;
  logWithContext('error', message, meta);
};

module.exports = {
  logInfo,
  logWarn,
  logError,
};

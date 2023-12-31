import fs from 'fs';
import path from 'path';

import { logger } from '../utils/Logger';

describe('Logger Configuration', () => {
  const logDirectory = path.join(process.cwd(), 'log');

  test('Log directory is created if not exists', () => {
    const directoryExists = fs.existsSync(logDirectory);
    expect(directoryExists).toBeTruthy();
  });

  test('Logger level is set correctly', () => {
    const level = logger.level;
    expect(level).toBe(process.env.PINO_LOG_LEVEL ?? 'info');
  });
});

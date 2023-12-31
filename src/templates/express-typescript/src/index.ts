import { app } from './app';
import { logger } from './utils/Logger';

const port = process.env.APP_PORT ?? 3000;

// Start server
app.listen(port, () => {
  logger.info(`Server is listening on port ${port}!`);
});

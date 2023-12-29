import { app } from './app';

const port = process.env.APP_PORT ?? 3000;

// Start server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${port}!`);
});

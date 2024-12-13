import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const startServer = (initialPort: number) => {
  const server = app.listen(initialPort)
    .on('listening', () => {
      const actualPort = (server.address() as any).port;
      console.log(`Server running at http://localhost:${actualPort}`);
    })
    .on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${initialPort} is busy, trying ${initialPort + 1}...`);
        startServer(initialPort + 1);
      } else {
        console.error('Server error:', err);
      }
    });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Server shutdown complete');
    });
  });

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Server shutdown complete');
      process.exit(0);
    });
  });

  return server;
};

const initialPort = parseInt(process.env.PORT || '3001', 10);
startServer(initialPort); 
import 'dotenv/config';
import prisma from './lib/prisma';
import { createApp } from './app';

const PORT = Number(process.env.PORT) || 4000;

async function bootstrap(): Promise<void> {
  // Verify DB connection before accepting traffic
  await prisma.$connect();
  console.info('✅ Database connected');

  const app = createApp();

  const server = app.listen(PORT, () => {
    console.info(`🚀 Server running on http://localhost:${PORT}`);
    console.info(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    console.info(`\n${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.info('💤 Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

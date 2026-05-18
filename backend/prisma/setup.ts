import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.info('Setting up SQLite database...');

  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "quizzes" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" DATETIME NOT NULL
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "questions" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "text" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      "quiz_id" TEXT NOT NULL,
      CONSTRAINT "questions_quiz_id_fkey"
        FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "options" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "label" TEXT NOT NULL,
      "is_correct" BOOLEAN NOT NULL DEFAULT false,
      "order" INTEGER NOT NULL,
      "question_id" TEXT NOT NULL,
      CONSTRAINT "options_question_id_fkey"
        FOREIGN KEY ("question_id") REFERENCES "questions" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  console.info('Database is ready.');
}

main()
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

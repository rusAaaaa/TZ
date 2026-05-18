import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.info('🌱 Seeding database...');

  // Clean existing data
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  // --- Quiz 1: General Knowledge ---
  await prisma.quiz.create({
    data: {
      title: 'General Knowledge',
      questions: {
        create: [
          {
            text: 'Is the Great Wall of China visible from space with the naked eye?',
            type: 'BOOLEAN',
            order: 1,
            options: {
              create: [
                { label: 'True', isCorrect: false, order: 1 },
                { label: 'False', isCorrect: true, order: 2 },
              ],
            },
          },
          {
            text: 'What is the capital of Australia?',
            type: 'INPUT',
            order: 2,
            options: {
              create: [{ label: 'Canberra', isCorrect: true, order: 1 }],
            },
          },
          {
            text: 'Which of the following are planets in our Solar System?',
            type: 'CHECKBOX',
            order: 3,
            options: {
              create: [
                { label: 'Mars', isCorrect: true, order: 1 },
                { label: 'Pluto', isCorrect: false, order: 2 },
                { label: 'Jupiter', isCorrect: true, order: 3 },
                { label: 'Titan', isCorrect: false, order: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  // --- Quiz 2: JavaScript Basics ---
  await prisma.quiz.create({
    data: {
      title: 'JavaScript Basics',
      questions: {
        create: [
          {
            text: 'Is JavaScript a statically typed language?',
            type: 'BOOLEAN',
            order: 1,
            options: {
              create: [
                { label: 'True', isCorrect: false, order: 1 },
                { label: 'False', isCorrect: true, order: 2 },
              ],
            },
          },
          {
            text: 'What keyword is used to declare a constant in JavaScript?',
            type: 'INPUT',
            order: 2,
            options: {
              create: [{ label: 'const', isCorrect: true, order: 1 }],
            },
          },
          {
            text: 'Which of the following are valid JavaScript data types?',
            type: 'CHECKBOX',
            order: 3,
            options: {
              create: [
                { label: 'string', isCorrect: true, order: 1 },
                { label: 'integer', isCorrect: false, order: 2 },
                { label: 'boolean', isCorrect: true, order: 3 },
                { label: 'symbol', isCorrect: true, order: 4 },
                { label: 'character', isCorrect: false, order: 5 },
              ],
            },
          },
        ],
      },
    },
  });

  console.info('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

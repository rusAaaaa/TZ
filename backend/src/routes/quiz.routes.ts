import { Router, Request, Response, NextFunction } from 'express';
import { createQuizSchema } from '../validators/quiz.validator';
import * as quizService from '../services/quiz.service';
import { ApiSuccess } from '../types';

const router = Router();

// GET /quizzes — list all quizzes (title + question count)
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await quizService.getAllQuizzes();
    const body: ApiSuccess<typeof data> = { success: true, data };
    res.json(body);
  } catch (err) {
    next(err);
  }
});

// GET /quizzes/:id — full quiz detail
router.get(
  '/:id',
  async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await quizService.getQuizById(req.params.id);
      const body: ApiSuccess<typeof data> = { success: true, data };
      res.json(body);
    } catch (err) {
      next(err);
    }
  },
);

// POST /quizzes — create a new quiz
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createQuizSchema.parse(req.body);
    const data = await quizService.createQuiz(parsed);
    const body: ApiSuccess<typeof data> = { success: true, data };
    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
});

// DELETE /quizzes/:id — delete a quiz (cascade)
router.delete(
  '/:id',
  async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await quizService.deleteQuiz(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

export default router;

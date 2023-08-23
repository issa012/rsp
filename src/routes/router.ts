import { Request, Response, Router } from 'express';
import { createGuest, findTopUsers, findUser } from '../services/user.service';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server!');
});

router.post('/guest-login', async function (req: Request, res: Response) {
  if (req.body.id) {
    console.log(req.body.id);
    const results = await findUser(req.body.id);
    return res.json(results);
  }
  const results = await createGuest();
  return res.json(results);
});

router.get('users/:id', async function (req: Request, res: Response) {
  const userId = +req.params.id;
  const results = await findUser(userId);
  return res.json(results);
});

router.get('/top10', async function (req: Request, res: Response) {
  const results = await findTopUsers();
  return res.json(results);
});

export default router;

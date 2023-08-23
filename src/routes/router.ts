import { Request, Response, Router } from 'express';
import { createGuest, findUser } from '../services/user.service';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server!');
});

router.post('/guest-login', async function (req: Request, res: Response) {
  if (req.get('Guest-Login')) {
    let user = JSON.parse(req.header('Guest-Login'));
    console.log(req.headers);
    const results = await findUser(user.id);
    return res.json(results);
  }
  const results = await createGuest();
  res.header('Guest-Login', JSON.stringify(results));
  return res.json(results);
});

export default router;

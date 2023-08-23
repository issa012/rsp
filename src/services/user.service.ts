import { db } from '../db/db';
import { User } from '../entity/user.entity';

const userRepository = db.getRepository(User);

export const createUser = async (user: User) => {
  return await userRepository.save(userRepository.create(user));
};

export const createGuest = async () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const guest = userRepository.create({ username: `Guest${randomNumber}` });
  return await userRepository.save(guest);
};

export const findUser = async (id: number) => {
  return await userRepository.findOne({
    where: {
      id: id,
    },
  });
};

export const findTopUsers = async () => {
  return await userRepository.createQueryBuilder('user').orderBy('user.wins', 'DESC').limit(10);
};

export const updateWins = async (id: number) => {
  await userRepository.increment({ id: id }, 'wins', 1);
};

export const updateGames = async (id: number) => {
  await userRepository.increment({ id: id }, 'games', 1);
};

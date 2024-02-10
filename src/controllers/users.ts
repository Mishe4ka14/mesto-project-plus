import { Request, Response } from 'express';
import User from '../models/users';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'какая-то ошибка' }));
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'какая-то ошибка поиска по ID' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, avatar, about } = req.body;
  User.create({ name, avatar, about })
    .then((user) => res.send(user))
    .catch(() => res.status(401).send({ message: 'ужасная ошибка' }));
};

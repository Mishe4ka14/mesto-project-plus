import { Request, Response } from 'express';
import User from '../models/users';

export const getUsers = (req: Request, res: Response) => {
  return User.find({})
    .then((users) => res.send({data: users}))
    .catch(() => res.status(500).send({message: 'какая-то ошибка'}));
};

export const getUserById = (req: Request,  res: Response) => {

  const {id} = req.params;

  return User.findById(id)
    .then((user) =>res.send({data: user}))
    .catch(() => res.status(500).send({message: 'какая-то ошибка поиска по ID'}));
}
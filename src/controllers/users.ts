import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/users';
import {
  ERROR_CODE_INTERNAL_SERVER_ERROR, ERROR_CODE_NOT_FOUND, CREATED_CODE,
} from '../utils/constants';
import { IUserRequest } from '../types';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((us) => res.send({ data: us }))
    .catch((err) => next(err));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, avatar, about, password, email,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      avatar,
      about,
    }))
    .then((user) => res.status(CREATED_CODE).send(user))
    .catch((err) => next(err));
};

export const changeUserInfo = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const id = req.user?._id;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => next(err));
};

export const changeUserAvatar = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const id = req.user?._id;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => next(err));
};

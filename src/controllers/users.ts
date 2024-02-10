import { Request, Response } from 'express';
import User from '../models/users';
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_INTERNAL_SERVER_ERROR, ERROR_CODE_NOT_FOUND } from '../utils/constants';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;

  User.findById({ id })
    .then((us) => res.send({ data: us }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      } else {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден.' });
      }
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, avatar, about } = req.body;
  User.create({ name, avatar, about })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      } else {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
    });
};

export const changeUserInfo = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const id = req.user?.id;

  User.findByIdAndUpdate(id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
    });
};

export const changeUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const id = req.user?.id;

  User.findByIdAndUpdate(id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
    });
};

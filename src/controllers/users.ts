import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export const getUserById = (res: Response, next: NextFunction, id: string) => {
  User.findById(id)
    .then((us) => res.send({ data: us }))
    .catch((err) => next(err));
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  getUserById(res, next, req.params.id);
};

export const getAuthorizedUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  getUserById(res, next, req.user?._id);
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

export const login = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user?._id },
        'some secret key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
      next();
    });
};

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import User from '../models/users';
import { CREATED_CODE } from '../utils/constants';
import { IUserRequest } from '../types';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUserById = (res: Response, next: NextFunction, id: string) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким ID не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  getUserById(res, next, req.params.id);
};

export const getAuthorizedUser = (req: IUserRequest, res: Response, next: NextFunction) => {
  getUserById(res, next, req.user?._id);
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, avatar, about, password, email,
  } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Пользователь с таким email уже существует');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      avatar,
      about,
    });
    res.status(CREATED_CODE).send(user);
  } catch (err) {
    next(err);
  }
};

const findUserAndUpdate = (id: string, obj: object, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(id, obj, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch(next);
};

export const changeUserInfo = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const id = req.user?._id;

  findUserAndUpdate(id, { name, about }, res, next);
};

export const changeUserAvatar = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const id = req.user?._id;

  findUserAndUpdate(id, { avatar }, res, next);
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
    .catch(next);
};

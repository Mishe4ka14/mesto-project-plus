import { Request, Response, NextFunction } from 'express';
import Card from '../models/cards';
import {
  ERROR_CODE_INTERNAL_SERVER_ERROR, ERROR_CODE_NOT_FOUND, CREATED_CODE,
} from '../utils/constants';
import { IUserRequest } from '../types';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

export const createCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const id = req.user?._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch((err) => next(err));
};

export const deleteCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const owner = req.user?._id;

  Card.findById(id)
    .then((card) => {
      if (card?.owner === owner) {
        Card.deleteOne(card?._id)
          .then(() => res.send({ message: 'удаление произошло успешно' }));
      } throw new Error('Вы можете удалять только свои карточки');
    })
    .catch((err) => next(err));
};

export const likeCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else res.send({ message: 'лайкусик поставлен' });
    })
    .catch((err) => next(err));
};

export const dislikeCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else res.send({ message: 'лайкусик поставлен' });
    })
    .catch((err) => next(err));
};

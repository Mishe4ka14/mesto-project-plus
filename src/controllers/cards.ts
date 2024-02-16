import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';
import Card from '../models/cards';
import { CREATED_CODE } from '../utils/constants';
import { IUserRequest } from '../types';
import ConflictError from '../errors/conflict-error';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const id = req.user?._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch(next);
};

export const deleteCard = (req: IUserRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const owner = req.user?._id;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (card.owner.toString() === owner) {
        Card.deleteOne(card._id);
      } else {
        throw new ConflictError('Вы можете удалять только свои карточки');
      }
    })
    .then(() => {
      res.send({ message: 'удаление произошло успешно' });
    })
    .catch(next);
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
        throw new NotFoundError('Передан несуществующий _id карточки');
      } res.send({ message: 'лайкусик поставлен' });
    })
    .catch(next);
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
        throw new NotFoundError('Передан несуществующий _id карточки');
      } res.send({ message: 'лайкусик поставлен' });
    })
    .catch(next);
};

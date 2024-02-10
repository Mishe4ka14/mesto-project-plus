import { Request, Response } from 'express';
import Card from '../models/cards';
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_INTERNAL_SERVER_ERROR, ERROR_CODE_NOT_FOUND } from '../utils/constants';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const id = req.user?.id;

  Card.create({ name, link, owner: id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      } else {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { id } = req.params;

  Card.findByIdAndRemove(id)
    .then(() => res.send({ message: 'удаление произошло успешно' }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      } else {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    });
};

export const likeCard = (req: Request, res: Response) => {
  const id = req.user?.id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(() => res.send({ message: 'лайкусик поставлен' }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      }
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const id = req.user?.id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } }, // убрать _id из массива
    { new: true },
  )
    .then(() => res.send({ message: 'лайкусик удален' }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      }
    });
};

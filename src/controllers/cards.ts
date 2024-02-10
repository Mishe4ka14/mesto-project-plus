import { Request, Response } from 'express';
import Card from '../models/cards';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'какая-то ошибка в получении карточек' }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const id = req.user?.id;

  Card.create({ name, link, owner: id })
    .then((card) => res.send(card))
    .catch(() => res.status(400).send({ message: 'ошибка создания карточки' }));
};

export const deleteCard = (req: Request, res: Response) => {
  const { id } = req.params;

  Card.findByIdAndRemove(id)
    .then(() => res.send({ message: 'удаление произошло успешно' }))
    .catch(() => res.status(500).send({ message: 'ошибка при удалении' }));
};

export const likeCard = (req: Request, res: Response) => {
  const id = req.user?.id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(() => res.send({ message: 'лайкусик поставлен' }))
    .catch(() => res.status(500).send({ message: 'что-то пошло не так' }));
};

export const dislikeCard = (req: Request, res: Response) => {
  const id = req.user?.id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } }, // убрать _id из массива
    { new: true },
  )
    .then(() => res.send({ message: 'лайкусик удален' }))
    .catch(() => res.status(500).send({ message: 'что-то пошло не так' }));
};

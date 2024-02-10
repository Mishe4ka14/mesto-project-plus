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

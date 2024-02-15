import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';
import { createCardValidator, deleteCardValidator } from '../validation/card-validators';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidator, createCard);
router.delete('/:id', deleteCardValidator, deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;

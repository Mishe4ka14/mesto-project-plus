import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';
import { createCardValidator, deleteCardValidator, likeCardValidation } from '../validation/card-validators';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidator, createCard);
router.delete('/:id', deleteCardValidator, deleteCard);
router.put('/:cardId/likes', likeCardValidation, likeCard);
router.delete('/:cardId/likes', likeCardValidation, dislikeCard);

export default router;

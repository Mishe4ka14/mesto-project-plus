import { celebrate, Joi } from 'celebrate';

export const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
});

export const deleteCardValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().alphanum(),
  }),
});

export const likeCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum(),
  }),
});

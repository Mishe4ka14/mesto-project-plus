import { celebrate, Joi } from 'celebrate';

export const getUserByIDValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum(),
  }),
});

export const changeUserInfoValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

export const changeUserAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
});

export const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

export const createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    avatar: Joi.string().uri(),
  }),
});

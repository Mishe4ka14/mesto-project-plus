import { Request, Response, NextFunction } from 'express';
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_INTERNAL_SERVER_ERROR } from '../utils/constants';

const handleErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'CastError') {
    res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id' });
  } else if (err.name === 'ValidationError') {
    const errors: any = Object.keys(err.errors)
      .map((field) => ({ [field]: err.errors[field].message }));
    res.status(ERROR_CODE_BAD_REQUEST).send(errors);
  } else {
    res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Произошла непредвиденная ошибка' });
  }

  next(err);
};

export default handleErrors;

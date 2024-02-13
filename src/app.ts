import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { ERROR_CODE_NOT_FOUND } from './utils/constants';
import handleErrors from './middlewares/error-middleware';
import { IUserRequest } from './types';
// подключаемся к серверу MongoiDB
mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();
// добавляем helmet для защиты приложения
const helmet = require('helmet');

app.use((req: IUserRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65c769c51f14970f6f284d9d',
  };

  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.get('/', (req, res) => {
  res.send('HELLO! Это рабочий сервер Express.');
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

// обработчик ошибок для всех контроллеров
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleErrors(err, req, res, next);
});

app.listen(PORT, () => {
  // console.log('Сервер запущен на порту 3000');
});

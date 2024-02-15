import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { ERROR_CODE_NOT_FOUND } from './utils/constants';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();
const helmet = require('helmet');

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('HELLO! Это рабочий сервер Express.');
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/cards', cardRouter);
app.use('/users', userRouter);

app.use('*', (req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  // console.log('Сервер запущен на порту 3000');
});

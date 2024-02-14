import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { ERROR_CODE_NOT_FOUND } from './utils/constants';
import handleErrors from './middlewares/error-middleware';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();
const helmet = require('helmet');

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.get('/', (req, res) => {
  res.send('HELLO! Это рабочий сервер Express.');
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

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

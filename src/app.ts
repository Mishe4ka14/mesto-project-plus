import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import { createUserValidator, loginValidator } from './validation/user-validators';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/error-handler';

mongoose.connect('mongodb://localhost:27017/mydatabase');

const { PORT = 3000 } = process.env;

const app = express();
const helmet = require('helmet');
const { errors } = require('celebrate');

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('HELLO! Это рабочий сервер Express.');
});

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);

app.use(auth);

app.use('/cards', cardRouter);
app.use('/users', userRouter);

app.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // console.log('Сервер запущен на порту 3000');
});

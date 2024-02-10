import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';

// Расширяем интерфейс Request, добавляя свойство user ВРЕМЕННОЕ РЕШЕНИЕ ЧТОБЫ НЕ РУГАЛСЯ TS
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
// подключаемся к серверу MongoiDB
mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('HELLO! Это рабочий сервер Express.');
});

app.use('/users', userRouter);

//временная авторизация
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    id: '65c769c51f14970f6f284d9d'
  };

  next();
});
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  // console.log('Сервер запущен на порту 3000');
});

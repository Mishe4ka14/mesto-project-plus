import express from 'express';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import userRouter from './routes/users';

// подключаемся к серверу MongoiDB
mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('HELLO! Это рабочий сервер Express.');
});

app.use('/users', userRouter);

app.listen(PORT, () => {
  // console.log('Сервер запущен на порту 3000');
});


// id пользователя для авторизации 65c769c51f14970f6f284d9d


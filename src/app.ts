import express from 'express';

const {PORT = 3000} = process.env;

const app = express();

app.get('*', (req, res) => {
  res.send('HELLO! Это рабочий сервер Express.');
});

app.listen(PORT, () => {
  console.log('Сервер запущен на порту 3000');
});
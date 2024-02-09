import express from 'express';
import { MongoClient } from 'mongodb';


/* Создаём экземпляр MongoClient, передав URL для подключения к MongoDB */
const client = new MongoClient('mongodb://localhost:27017/mestodb');
async function main() {
  await client.connect();
}

main().catch(error => console.error(error));

const {PORT = 3000} = process.env;

const app = express();

app.get('*', (req, res) => {
  res.send('HELLO! Это рабочий сервер Express.');
});

app.listen(PORT, () => {
  console.log('Сервер запущен на порту 3000');
});
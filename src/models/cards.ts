import mongoose, { Date } from 'mongoose';

interface ICard {
  name: string,
  link: string,
  owner: mongoose.Types.ObjectId,
  likes: mongoose.Types.ObjectId[],
  createdAt: Date;
}
const validator = require('validator');

const cardSchema = new mongoose.Schema<ICard>(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено'],
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Поле "owner" должно быть заполнено'],
      ref: 'user',
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);
export default mongoose.model<ICard>('card', cardSchema);

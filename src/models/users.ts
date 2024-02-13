import mongoose from 'mongoose';

interface IUser {
  name: string,
  about: string,
  avatar: string
  email: string,
  password: string,
}
const validator = require('validator');

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Некорректный Email',
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
    },
  },
  { versionKey: false },
);
export default mongoose.model<IUser>('user', userSchema);

import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../errors/unauthorized-error';

interface IUser {
  name: string,
  about: string,
  avatar: string
  email: string,
  password: string,
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) // eslint-disable-line no-unused-vars
  => Promise<Document<IUser> | null >;
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
      select: false,
    },
  },
  { versionKey: false },
);

// добавляем модели метод проверки почты
userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: IUser) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user;
        });
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);

import { Router } from 'express';
import {
  getUsers, changeUserInfo, changeUserAvatar, getUser, getAuthorizedUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', getAuthorizedUser);
router.patch('/me', changeUserInfo);
router.patch('/me/avatar', changeUserAvatar);
export default router;

import { Router } from 'express';
import {
  getUsers, changeUserInfo, changeUserAvatar, getUser, getAuthorizedUser,
} from '../controllers/users';
import { getUserByIDValidator, changeUserAvatarValidator, changeUserInfoValidator } from '../validation/user-validators';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserByIDValidator, getUser);
router.get('/me', getUserByIDValidator, getAuthorizedUser);
router.patch('/me', changeUserInfoValidator, changeUserInfo);
router.patch('/me/avatar', changeUserAvatarValidator, changeUserAvatar);
export default router;

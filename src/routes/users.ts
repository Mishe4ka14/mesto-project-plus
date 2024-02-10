import { Router } from 'express';
import { getUsers, getUserById, createUser, changeUserInfo, changeUserAvatar } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', changeUserInfo);
router.patch('/me/avatar', changeUserAvatar);
export default router;

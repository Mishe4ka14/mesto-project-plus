import { Router } from "express";
import { getUsers, getUserById } from "../controllers/users";

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
export default router;
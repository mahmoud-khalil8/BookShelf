import express from 'express'
import {getAllUsers, createUser, getUser, updateUser, deleteUser} from '../controllers/userController.js'
import { login, protect, signup } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);


router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const userRouter = router;
export default userRouter;
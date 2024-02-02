import express from 'express'
import {getAllUsers, createUser, getUser, updateUser, deleteUser} from '../controllers/userController.js'
import { forgotPassword, login, protect, signup } from '../controllers/authController.js';
import { resetPassword } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgetPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);


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
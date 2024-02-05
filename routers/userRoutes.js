import express from 'express'
import {getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe} from '../controllers/userController.js'
import { forgotPassword, login, protect, signup, updatePassword } from '../controllers/authController.js';
import { resetPassword } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword',protect, updatePassword);
router.patch('/updateMe', protect,updateMe);


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
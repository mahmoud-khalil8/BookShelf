import express from 'express';
import {
  //  checkId,
  //checkBody,
  getAllBooks,
  getBook,
  postBook,
  updateBook,
  deleteBook,
  aliasBiggestBooks,
  getBookStats,
  getGroupFiction,
} from '../controllers/bookcontrollers.js';
import { protect, restrictTo, signup } from '../controllers/authController.js';

const router = express.Router();
router.post('/signup' , signup) ;


//router.param('id' ,checkId) ;

/*Sets up middleware to be executed whenever the id parameter is present in a route.
This is often used for parameter validation or preprocessing.*/

//defining routes
router.route('/top-5-books').get(aliasBiggestBooks, getAllBooks);
router.route('/stats').get(getBookStats);
router.route('/groupFiction').get(getGroupFiction);
router.route('/').get(protect,getAllBooks).post( postBook);

router.route('/:id').get(getBook).patch(updateBook).delete(protect,restrictTo('admin'),deleteBook);

const bookRouter = router;
export default bookRouter;

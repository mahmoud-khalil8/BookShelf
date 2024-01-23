import express from 'express';
import {
  //  checkId,
  //checkBody,
  getAllBooks,
  getBook,
  postBook,
  updateBook,
  deleteBook,
} from '../controllers/bookcontrollers.js';

const router = express.Router();

//router.param('id' ,checkId) ;

/*Sets up middleware to be executed whenever the id parameter is present in a route.
This is often used for parameter validation or preprocessing.*/

//defining routes
router.route('/').get(getAllBooks).post(/*checkBody,*/ postBook);

router.route('/:id').get(getBook).patch(updateBook).delete(deleteBook);

const bookRouter = router;
export default bookRouter;

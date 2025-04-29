import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';


router
  .route('/register')
  .get(async (req, res) => {
    // registeration page
    res.render('register');
  })
  .post(async (req, res) => {
    // user registration
});

router
  .route('/login')
  .get(async (req, res) => {
    // registeration page
    res.render('login');
  })
  .post(async (req, res) => {
    // user registration
});

export default router;
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
    // login page
    res.render('login');
  })
  .post(async (req, res) => {
    // user login
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

// profile based on user id... /:id, update this route and handlebars later
router
  .route('/profile')
  .get(async (req, res) => {
    // check if user is logged in(and its the correct user), get user data... 

    // profile page
    res.render('profile');
  })
  .post(async (req, res) => {
    // user registration
});

export default router;
import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';

router.route('/').get(async (req, res) => {
    res.render('homepage'); // render the home page, maybe it changes on login
    // home page 
});


// could be in another file like users.js 
//router
//  .route('/register')
//  .get(async (req, res) => {
//    // registeration page
//    res.render('register');
//  })
//  .post(async (req, res) => {
//    // user registration
//});

export default router;
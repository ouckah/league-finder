import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';

router.route('/').get(async (req, res) => {

    res.render('homepage',{title:"League Finder"}); // render the home page, maybe it changes on login
    // home page 
});

export default router;
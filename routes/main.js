import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';

router.route('/').get(async (req, res) => {
    let isLog = false;
    let userId = ""

    if (req.session && req.session.user) {
        isLog = true;
        userId = req.session.user.userId;
    }

    res.render('homepage',{title:"League Finder",isLoggedIn: isLog, personalID: userId}); // render the home page, maybe it changes on login
    // home page 
});

export default router;
import {Router} from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
    res.render('homepage',{title:"League Finder"}); 
});

export default router;
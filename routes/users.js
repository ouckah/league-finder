import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import data from '../data/users.js';


router
  .route('/register')
  .get(async (req, res) => {
    // registeration page
    res.render('register');
  })
  .post(async (req, res) => {
    // validate user input
    if (!req.body) {
      return res.status(400).json({ error: 'All fields are required' }); // add render page with the error message
    }

    const { firstName, lastName, email, username, password, confirmPassword } = req.body;

    try{
      //add user validation
    } catch(e){
      return res.status(400).json({ error: e }); // create render page with the error message
    }

    // user registration
    try {
      const user = await data.createUser(firstName, lastName, email, username, password);
      res.redirect('/users/login'); // redirect to login page after successful registration
    } catch (e) {
      return res.status(500).json({ error: e }); // add render page with the error message
    }

});

router
  .route('/login')
  .get(async (req, res) => {
    // login page
    res.render('login');
  })
  .post(async (req, res) => {
    if(!req.body || Object.keys(req.body).length === 0){
      return res.status(400).json({ error: 'All fields are required' }); // add render page with the error message
    }

    let {username,password} = req.body;

    try{
      //add user validation
    } catch(e){
      return res.status(400).json({ error: e }); // create render page with the error message
    }

    // user login

    try{
      const user = await data.loginUser(username, password);

      // prob dont need to store all this, adjust later :D
      req.session.user = {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        firstName: user.firstName,
        lastName: user.lastName,
        biography: user.biography,
        riotId: user.riotId,
        region: user.region,
        preferredRoles: user.preferredRoles,
        rank: user.rank,
        reputation: user.reputation,
        friends: user.friends
      };

      res.redirect('/'); // redirect to homepage after successful login 
    }catch(e){
      return res.status(400).render('login',{error: e});
    }

});

// profile based on user id... /:id, update this route and handlebars later
router
  .route('/profile')
  .get(async (req, res) => {
    // if user is logged in, then give ability to edit profile? Add everything for logged in user
    // but maybe we should make other peoples profile viewable too? so we should add a userid to the url
    // just use a finduser data function and render new page

    // profile page
    res.render('profile');
  })
  .post(async (req, res) => {
    // profile editing
});

router.route('/logout').get(async (req, res) => {
  req.session.destroy();
  res.render('logout');
});


export default router;
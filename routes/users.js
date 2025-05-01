import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import validation from '../public/util/validation.js';
import { createUser, editUser, loginUser, deleteUser, getUser } from '../data/users.js';
import { protectedRoute } from '../utils/middleware.js';


router
  .route('/register')
  .get(async (req, res) => {
    // registeration page
    res.render('register', {title: "Register"});
  })
  .post(async (req, res) => {
    // validate user input
    if (!req.body) {
      return res.status(400).json({ error: 'All fields are required' }); // add render page with the error message
    }

    let { firstName, lastName, email, username, password, confirmPassword } = req.body;

    try {
      validation.validateRegistration(
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword
      )
    } catch (e) {
      return res.status(400).json({ error: e.message }); // create render page with the error message
    }

    // user registration
    try {
      const user = await createUser(firstName, lastName, email, username, password);
      res.redirect('/users/login'); // redirect to login page after successful registration
    } catch (e) {
      return res.status(500).json({ error: e.message }); // add render page with the error message
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    // login page
    res.render('login', {title: "Login"}); // render the login page
  })
  .post(async (req, res) => {
    if(!req.body || Object.keys(req.body).length === 0){
      return res.status(400).json({ error: 'All fields are required' }); // add render page with the error message
    }

    let {username,password} = req.body;

    try {
      // 2-20 characters again maybe
      username = helpers.checkString(username);
      helpers.checkStringWithLength(username, 2, 20, /^[a-zA-Z0-9]+$/);

      // no spaces, atleast 1 capital, numbers, special characters
      helpers.checkString(password);

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(password)) {
        throw new Error('Password must contain at least one uppercase letter');
      }
      if (!/[0-9]/.test(password)) {
        throw new Error('Password must contain at least one number');
      }
      if (!/[^a-zA-Z0-9 ]/.test(password)) {
        throw new Error('Password must contain at least one special character');
      }
    } catch(e) {
      return res.status(400).json({ error: e.message }); // create render page with the error message
    }

    // user login
    try {
      const user = await loginUser(username, password);

      // store id
      req.session.user = {
        userId: user.userId,  
        brainrot: user.myFavoriteBrainrot
      };

      res.redirect('/'); // redirect to homepage after successful login 
    } catch (e) {
      return res.status(400).json({ error: e.message }); 
    }

});

// profile based on user id... /:id, update this route and handlebars later
router
  .route('/profile/:id')
  .get(async (req, res) => {
    // if user is logged in, then give ability to edit profile? Add everything for logged in user
    // but maybe we should make other peoples profile viewable too? so we should add a userid to the url
    // just use a finduser data function and render new page

    try {
      req.params.id = helpers.checkId(req.params.id.toString(),"id");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const user = await getUser(req.params.id); 

      res.render('profile',{title: user.username + "'s Profile",  profilePicture: user.profilePicture, username: user.username, biography: user.biography, riotId: user.riotId,region:user.region,preferredRoles:user.preferredRoles,rank:user.Rank, reputation: user.reputation, friends: user.friends}); // render the profile page with the user data
    } catch (e) {
      return res.status(400).json({ error: e.message }); 
    }


    // profile page

  })
  .post(async (req, res) => {
    // profile editing
  });

router.route('/logout').get(async (req, res) => {
  req.session.destroy();
  res.render('logout', { title: "Logged Out" });
});


export default router;
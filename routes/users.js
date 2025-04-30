import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import data from '../data/users.js';


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
      firstName = helpers.checkString(firstName);
      helpers.checkStringWithLength(firstName, 2, 20, /^[a-zA-Z]+$/);
      lastName = helpers.checkString(lastName);
      helpers.checkStringWithLength(lastName, 2, 20, /^[a-zA-Z]+$/);
  
      // email regex : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/ maybe?
      email = helpers.checkString(email);
      helpers.checkStringWithLength(email, 5, 255, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/);
  
      // 2-20 characters again maybe
      username = helpers.checkString(username);
      helpers.checkStringWithLength(username, 2, 20, /^[a-zA-Z0-9]+$/);

      // password
      helpers.checkString(password);
      helpers.checkString(confirmPassword);
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
    } catch (e) {
      return res.status(400).json({ error: e.message }); // create render page with the error message
    }

    // user registration
    try {
      const user = await data.createUser(firstName, lastName, email, username, password);
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
      const user = await data.loginUser(username, password);

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

    let isLog = false;
    let userId = "";

    if (req.session && req.session.user) {
      isLog = true;
      userId = req.session.user.userId; // get the user id from the session, not sure if we need it to validated
    }

    try {
      req.params.id = helpers.checkId(req.params.id.toString(),"id");
    } catch(e) {
      console.log(e);
      return res.status(400).json({ error: e.message });
    }

    try {
      const user = await data.getUser(req.params.id); 

      res.render('profile',{title: user.username + "'s Profile",personalID: userId,isLoggedIn: isLog, profilePicture: user.profilePicture, username: user.username, biography: user.biography,riotId: user.riotId,region:user.region,preferredRoles:user.preferredRoles,rank:user.Rank, reputation: user.reputation, friends: user.friends}); // render the profile page with the user data
    } catch (e) {
      console.log(e);
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
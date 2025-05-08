import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';
import { createUser, editUser, loginUser, deleteUser, getUser } from '../data/users.js';
import { protectedRoute } from '../utils/middleware.js';


router
  .route('/register')
  .get(async (req, res) => {
    // registeration page
    res.render('users/register', {title: "Register"});
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
      console.log(e);
      return res.status(500).json({ error: e.message }); // add render page with the error message
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    // login page
    res.render('users/login', {title: "Login"}); // render the login page
  })
  .post(async (req, res) => {
    if(!req.body || Object.keys(req.body).length === 0){
      return res.status(400).json({ error: 'All fields are required' }); // add render page with the error message
    }

    let {username,password} = req.body;

    try {
      username, password = validation.validateLogin(username, password); // validate user login
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

    let isOwner = false;
    // check if user is logged in
    if (req.session.user && (req.session.user.userId === req.params.id)) {
      isOwner = true; // if user is logged in and the id matches, then they are the owner of the profile
    } 

    try {
      const user = await getUser(req.params.id); 

      res.render('users/profile',{title: user.username + "'s Profile",  isOwner: isOwner,profilePicture: user.profilePicture, username: user.username, biography: user.biography, riotId: user.riotId,region:user.region,preferredRoles:user.preferredRoles,rank:user.Rank, reputation: user.reputation, friends: user.friends}); // render the profile page with the user data
    } catch (e) {
      return res.status(400).json({ error: e.message }); 
    }


    // profile page

  });

  router
  .route('/profile/:id/edit')
  .all(protectedRoute) 
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

      res.render('users/profile',{title: user.username + "'s Profile",  profilePicture: user.profilePicture, username: user.username, biography: user.biography, riotId: user.riotId,region:user.region,preferredRoles:user.preferredRoles,rank:user.Rank, reputation: user.reputation, friends: user.friends}); // render the profile page with the user data
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
  res.render('users/logout', { title: "Logged Out", isLoggedIn: false }); 
});


export default router;

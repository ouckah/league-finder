import { Router } from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';
import * as friendData from '../data/friends.js'
import { getPuuid, getWinLoss } from '../data/api.js';
import { createUser, editUser, loginUser, deleteUser, getUser, getWR, getMatches,getUserByUsername} from '../data/users.js';
import { protectedRoute } from '../utils/middleware.js';
import { deleteUserComments } from '../data/comments.js';
import { deleteUserPosts } from '../data/posts.js';
import { getFriends } from '../data/friends.js';


router
  .route('/register')
  .get(async (req, res) => {
    // registeration page
    res.render('users/register', { title: "Register" });
  })
  .post(async (req, res) => {
    // validate user input
    if (!req.body) {
      return res.status(400).json({error: 'All fields are required' });
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
      return res.status(400).json({error: e }); // create render page with the error message
    }

    // user registration
    try {
      const user = await createUser(firstName, lastName, email, username, password);
      res.status(200).json({message: 'User created successfully'}); // redirect to login page after successful registration
    } catch (e) {
      return res.status(500).json({error: e }); // add render page with the error message
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    // login page
    res.render('users/login', { title: "Login" }); // render the login page
  })
  .post(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let { username, password } = req.body;

    try {
      username, password = validation.validateLogin(username, password); // validate user login
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // user login
    try {
      const user = await loginUser(username, password);

      // store id
      req.session.user = {
        userId: user.userId,
        brainrot: user.myFavoriteBrainrot
      };

      return res.status(200).json({ message: 'Login successful' });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });
  
router
  .route('/profile')
  .get(async (req, res) => {
    let { username } = req.query;
  
    try {
      username = helpers.checkString(username, "username");
      helpers.checkStringWithLength(username, 2, 20, /^[a-zA-Z]+$/, "username");
      let user = await getUserByUsername(username);
      res.redirect(`/users/profile/${user._id.toString()}`); // redirect to the profile page of the user
    } catch (e) {
      return res.status(400).render('error', { error: e}); // create render page with the error message
    }
  });
  
// profile based on user id... /:id, update this route and handlebars later
router
  .route('/profile/:id')
  .get(async (req, res) => {
    // maybe make a search user profile searchbar... 

    try {
      req.params.id = helpers.checkId(req.params.id.toString(), "id");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    let isOwner = false;
    // check if user is logged in
    if (req.session.user && (req.session.user.userId === req.params.id)) {
      isOwner = true; // if user is logged in and the id matches, then they are the owner of the profile
    }

    let isFriend = false;
    // check if user is friends with logged in user
    if (req.session.user) {
      const friendStatus = await friendData.getFriendStatus(req.session.user.userId, req.params.id)
      isFriend = friendStatus == "accepted";
    }

    try {
      const user = await getUser(req.params.id);
      const friends = await getFriends(req.params.id)
      let wr = 'N/A';
      let matches;
      if (user.riotId.length > 0) {
        wr = await getWR(req.params.id)
        matches = await getMatches(req.params.id)
      }
      res.render('users/profile', { title: user.username + "'s Profile", id: user._id, isOwner: isOwner, isFriend: isFriend, profilePicture: user.profilePicture, username: user.username, biography: user.biography, riotId: user.riotId, region: user.region, preferredRoles: user.preferredRoles, rank: user.rank, wr: wr, reputation: user.reputation, friends: friends, matches: matches }); 
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

router
  .route('/profile/:id/edit')
  .all(protectedRoute)
  .get(async (req, res) => {
    try {
      req.params.id = helpers.checkId(req.params.id.toString(), "id");
    } catch (e) {
      return res.status(400).render('users/editprofile', { title: "Edit Profile", errorMessage: e });
    }

    try {
      const user = await getUser(req.params.id);

      res.render('users/editprofile', { title: user.username + "Edit Your Profile", user}); // render the profile page with the user data
    } catch (e) {
      return res.status(400).render('users/editprofile', { title: "Edit Profile", errorMessage: e });
    }


    // profile page

  })
  .patch(async (req, res) => {
    // profile editing
    if (!req.body) {
      return res.status(400).json({ error: 'Fields are not filled out.' });
    }
    let { username, email, biography, riotId, region, preferredRoles, profilePicture } = req.body;
    try {
      validation.validateEdit(username, email, biography, riotId, region, preferredRoles, profilePicture);
      // Checks if provided riotId is real.
      if (riotId.length > 0) {
        helpers.checkStringWithLength(riotId, 3, 22, /^.{1,16}#.{1,5}$/);
        const riotName = riotId.split('#');
        const puuid = await getPuuid(riotName[0], riotName[1], region);
      }
      const updateUser = await editUser(req.session.user.userId, username, email, biography, riotId, region, preferredRoles, profilePicture);
      return res.status(200).json({ userId: req.session.user.userId });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router.route('/logout').get(async (req, res) => {
  req.session.destroy();
  res.render('users/logout', { title: "Logged Out", isLoggedIn: false });
});

router
  .route('/profile/:id/delete')
  .all(protectedRoute)
  .get(async (req, res) => {
    try {
      req.params.id = helpers.checkId(req.params.id.toString(), "id");
    } catch (e) {
      return res.status(400).json({ error: e }); // create render page with the error message
    }

    try {
      const user = await getUser(req.params.id);
      res.render('users/deleteprofile', { title: "Delete Profile", username: user.username });
    } catch (e) {
      return res.status(400).json({error: e}); // create render page with the error message
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.id = helpers.checkId(req.params.id.toString(), "id");
      req.body.confirm = helpers.checkString(req.body.confirm, "username");
      helpers.checkStringWithLength(req.body.confirm, 2, 20, /^[a-zA-Z0-9]+$/);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const user = await getUser(req.params.id);          
      if (req.body.confirm.toLowerCase() !== user.username.toLowerCase()) { // check if the username matches the one in the database
        throw 'Username does not match'; 
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const commentsDeleted = await deleteUserComments(req.params.id);
      const postsDeleted = await deleteUserPosts(req.params.id);
      const userDeleted = await deleteUser(req.params.id);
      req.session.destroy(); // destroy session after user deletion
      return res.status(200).json({ message: 'User deleted successfully' }); // send success message
    } catch (e) {
      return res.status(500).json({error: e});
    }
  });


export default router;

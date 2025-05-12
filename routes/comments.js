import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import { protectedRoute} from '../utils/middleware.js';
import { createComment, likeComment } from '../data/comments.js';

router
  .route('/')
  .all(protectedRoute)
  .post(async (req, res) => {
    let { postId, content } = req.body;

    // maybe better input validation
    postId = helpers.checkId(postId.toString(), "postId");
    content = helpers.checkString(content, "content");

    // maybe still error check even if using middleware
    const userId = req.session.user.userId;

    const response = await createComment(userId, postId, content);

    //if (!response.commentCreated) {
    //  return res.render('/posts/${postId}', { error: "Failed to create comment." });
    //}

    return res.redirect(`/posts/${postId}`);
  });

/*
router
  .route('/')
  .all(protectedRoute)
  .post(async (req, res) => {
  });
*/



export default router;
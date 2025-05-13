import {Router} from 'express';
const router = Router();
import { validateComment } from '../utils/validation.js';
import { protectedRoute} from '../utils/middleware.js';
import { createComment } from '../data/comments.js';

router
  .route('/')
  .all(protectedRoute)
  .post(async (req, res) => {
    let { postId, content } = req.body;
    try{
      ({postId,content} = validateComment(postId,content));
  
      // maybe still error check even if using middleware
      const userId = req.session.user.userId;
      const response = await createComment(userId, postId, content);
      return res.status(200).json({message: "Comment created successfully."});
    } catch (e){
      return res.status(400).json({error: e});
    }

  });

/*
router
  .route('/')
  .all(protectedRoute)
  .post(async (req, res) => {
  });
*/



export default router;
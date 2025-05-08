import {Router} from 'express';
const router = Router();
import { createPost, getAllPosts, getPost } from '../data/posts.js';
import { protectedRoute} from '../utils/middleware.js';
import helpers from '../utils/helpers.js';

const createPostHandler = async (req, res) => {
  const { title, content, image, tags } = req.body;
  const userId = req.user.userId;

  // TODO validate inputs

  const response = await createPost(
    userId,
    image,
    title,
    content,
    tags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
  )

  if (!response.postCreated) {
    return res.render('posts/new_post', { error: "Failed to create post." });
  }

  return res.redirect('/posts');
}

router
  .route('/')
  .get(async (req, res) => {
    const posts = await getAllPosts();
    
    res.render('posts/posts', { posts });
  })

router
  .route('/new')
  .all(protectedRoute)
  .get(async (req, res) => {
    res.render('posts/new_post')
  })
  .post(createPostHandler)

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      req.params.id = helpers.checkId(req.params.id.toString(),"id");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const postId = req.params.id;
    let post = null;
    try {
      post = await getPost(postId);
      // comments = await getComments(postId);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    res.render('posts/view_post', { post /*,comments */});
  })

export default router;
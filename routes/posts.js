import {Router} from 'express';
const router = Router();
import { createPost, getAllPosts } from '../data/posts.js';
import { protectedRoute } from '../utils/middleware.js';
import helpers from '../utils/helpers.js';

const createPostHandler = async (req, res) => {
  const { title, content, image, tags } = req.body
  const userId = req.user.userId

  // TODO validate inputs

  const response = await createPost(
    userId,
    image,
    title,
    content,
    tags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
  )

  if (!response.postCreated) {
    return res.render('new_post', { error: "Failed to create post." })
  }

  return res.redirect('/posts');
}

router
  .route('/')
  .get(async (req, res) => {
    const posts = await getAllPosts()
    
    res.render('posts', { posts })
  })

router
  .route('/new')
  .all(protectedRoute)
  .get(async (req, res) => {
    res.render('new_post')
  })
  .post(createPostHandler)

export default router;
import {Router} from 'express';
const router = Router();
import { createPost, getAllPosts } from '../data/posts.js';
import helpers from '../utils/helpers.js';

const createPostHandler = async (req, res) => {
  const { title, content, image, tags } = req.body
  const userId = "68129fbdc3f5080de8c09fc0"

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
  .get(async (req, res) => {
    res.render('new_post')
  })
  .post(createPostHandler) // TODO: add middleware for authed user 

export default router;
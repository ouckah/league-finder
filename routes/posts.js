import {Router} from 'express';
const router = Router();
import { createPost, getAllPosts, getPost,editPost, deletePost, searchPosts } from '../data/posts.js';
import { getPostComments, deletePostComments } from '../data/comments.js';
import { getFriends } from '../data/friends.js';
import { protectedRoute} from '../utils/middleware.js';
import helpers from '../utils/helpers.js';
import { validatePost } from '../utils/validation.js';
const createPostHandler = async (req, res) => {
  let { title, content, image, tags } = req.body;
  const userId = req.user.userId;

  ({image, title, content, tags } = validatePost(image,title, content, tags));

  const response = await createPost(
    userId,
    image,
    title,
    content,
    tags
  )

  if (!response.postCreated) {
    return res.status(400).json({ error: "Failed to create post." });
  }

  return res.status(200).json({ message: "Post created successfully." });
}

router
  .route('/')
  .get(async (req, res) => {
    const posts = await getAllPosts();
    
    if (req.session.user) {
      const friends = await getFriends(req.session.user.userId);
      const friendIds = friends.map(f => f.friendId);

      posts.sort((a, b) => friendIds.includes(b.userId) - friendIds.includes(a.userId));
    }

    let returnedPosts = posts;
    if (req.query.postsSearch) {
      returnedPosts = await searchPosts(req.query.postsSearch);
    }
    
    res.render('posts/posts', {
      posts: returnedPosts,
      userId: req.session.user?.userId,
      title: 'Posts'
    });
  })

router
  .route('/new')
  .all(protectedRoute)
  .get(async (req, res) => {
    res.render('posts/new_post', {title: 'New Post'})
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
    let post;
    let comments;
    try {
      post = await getPost(postId);
      comments = await getPostComments(postId);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    res.render('posts/view_post', { 
      post,
      comments,
      userId: req.session.user?.userId,
      title: post.title
    });
  });

router
  .route('/:id/edit')
  .all(protectedRoute)
  .get(async (req, res) => {
    try {
      req.params.id = helpers.checkId(req.params.id.toString(),"id");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const postId = req.params.id;
    let post;
    try {
      post = await getPost(postId);

      // Check if user owns the post
      if (post.userId !== req.session.user.userId) {
        return res.status(403).render('error', { error: "You don't have permission to edit this post.", title: 'Error' });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    res.render('posts/edit_post', {title: "Edit Post", post});
  })
  .patch(async (req, res) => {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      req.params.id = helpers.checkId(req.params.id.toString(),"id");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // Check if user owns the post before allowing edit
    try {
      const post = await getPost(req.params.id);
      if (post.userId !== req.session.user.userId) {
        return res.status(403).render('error', { error: "You don't have permission to edit this post.", title: 'Error' });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    let { title, content, image, tags } = req.body;
    ({image, title, content, tags } = validatePost(image,title, content, tags));
    try {
      const response = await editPost(
        req.params.id,
        image,
        title,
        content,
        tags
      )
    } catch (e) {
      return res.status(400).json({ error: "Failed to update post." });
    }
    return res.status(200).json({postId: req.params.id});
  });


  router
  .route('/:id/delete')
  .all(protectedRoute)
  .get(async (req, res) => {
    try {
      req.params.id = helpers.checkId(req.params.id.toString(),"id");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const postId = req.params.id;
    let post;
    try {
      post = await getPost(postId);
      // Check if user owns the post
      if (post.userId !== req.session.user.userId) {
        return res.status(403).render('error', { error: "You don't have permission to delete this post.", title: 'Error' });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    res.render('posts/delete_post', {title: "Delete Post", postID: postId});
  })
  .delete(async (req, res) => {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    try {
      req.params.id = helpers.checkId(req.params.id.toString(),"id");
      req.body.confirm = helpers.checkString(req.body.confirm.toString(),"confirm");
      if (req.body.confirm !== 'confirm') {
        return res.status(400).json({ error: "Please type 'confirm' to delete the post." });
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // Check if user owns the post before allowing delete
    try {
      const post = await getPost(req.params.id);
      // this might not be the correct way to do this
      if (post.userId !== req.session.user.userId) {
        return res.status(403).render('error', { error: "You don't have permission to delete this post.", title: 'Error' });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const commentsDeleted = await deletePostComments(req.params.id);
      await deletePost(req.params.id);

      return res.status(200).json({message: "Post deleted successfully."});
    } catch (e) {
      return res.status(400).json({ error: "Failed to delete post." });
    }
  });

export default router;

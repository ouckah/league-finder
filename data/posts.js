import { posts } from '../config/mongoCollections.js';
import { getUser } from './users.js';
import { MongoNetworkTimeoutError, ObjectId } from 'mongodb';
import { deletePostComments } from './comments.js';
import Fuse from 'fuse.js';

const createPost = async (
    userId,
    image,
    title,
    content,
    tags
) => {
    if (!userId) throw 'You must provide a userId';
    if (!title) throw 'You must provide a title';
    if (!content) throw 'You must provide content';

    // Needs to be a real user
    const user = await getUser(userId);

    // image is optional.
    if (image) {
        if (typeof image !== 'string') throw 'image must be a string';
        if (image.trim() === '') throw 'image cannot be an empty string';
    }

    // title is required.
    if (typeof title !== 'string') throw 'title must be a string';
    if (title.trim() === '') throw 'title cannot be an empty string';

    // content is required.
    if (typeof content !== 'string') throw 'content must be a string';
    if (content.trim() === '') throw 'content cannot be an empty string';

    // tags are optional.
    if (tags) {
        if (!Array.isArray(tags)) throw 'tags must be an array';
        for (let i = 0; i < tags.length; i++) {
            if (typeof tags[i] !== 'string') throw 'tags must be strings';
            if (tags[i].trim() === '') throw 'tags cannot be empty strings';
        }
    }

    const post = {
        userId: userId,
        username: user.username,
        image: image || '',
        title: title,
        content: content,
        tags: tags || [],
        createdAt: new Date().toUTCString()
    }

    const postsCollection = await posts();
    const insertInformation = await postsCollection.insertOne(post);
    if (!insertInformation) throw 'Could not add post';

    return insertInformation.insertedId.toString();
}

const getPost = async (
    postId,
) => {
    if (!postId) throw 'You must provide an id to search for';
    if (typeof postId !== 'string') throw 'The id must be a string';
    if (!ObjectId.isValid(postId)) throw 'The id is not a valid ObjectId';

    const postsCollection = await posts();
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) throw 'No post with that id';

    return post;
}

const getAllPosts = async () => {
    const postsCollection = await posts();
    const allPosts = await postsCollection.find({}).toArray();
    return allPosts;
};

const editPost = async (
    postId,
    image,
    title,
    content,
    tags
) => {
    if (!postId) throw 'You must provide an id to search for';
    if (!title) throw 'You must provide a title';
    if (!content) throw 'You must provide content';

    const post = await getPost(postId);

    if (image) {
        if (typeof image !== 'string') throw 'The image must be a string';
        if (image.trim() === '') throw 'The image cannot be an empty string';
    }

    if (typeof title !== 'string') throw 'The title must be a string';
    if (title.trim() === '') throw 'The title cannot be an empty string';

    if (typeof content !== 'string') throw 'The content must be a string';
    if (content.trim() === '') throw 'The content cannot be an empty string';

    if (tags) {
        if (!Array.isArray(tags)) throw 'The tags must be an array';
        for (let i = 0; i < tags.length; i++) {
            if (typeof tags[i] !== 'string') throw 'The tags must be strings';
            if (tags[i].trim() === '') throw 'The tags cannot be empty strings';
        }
    }

    try {
        const post = await getPost(postId);
        const postCollection = await posts();
        const updatedPost = {
            image: image || '',
            title: title,
            content: content,
            tags: tags || [],
            createdAt: post.createdAt
        };
        await postCollection.updateOne(
            { _id: new ObjectId(postId) },
            { $set: updatedPost }
        );
        return { postUpdated: true };
    } catch (e) {
        throw e;
    }
}

const deletePost = async (
    postId,
) => {
    if (!postId) throw 'You must provide an id to search for';
    if (typeof postId !== 'string') throw 'The id must be a string';
    if (!ObjectId.isValid(postId)) throw 'The id is not a valid ObjectId';

    const postsCollection = await posts();
    const deletionInfo = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete post with id of ${postId}`;
    }

    return { postDeleted: true };
}

const getUserPosts = async (
    userId
) => {
    const user = await getUser(userId);

    const postsCollection = await posts();
    const posts = await postsCollection.find({ userId: new (userId) }).toArray();
    if (!posts) throw 'User has no posts';

    return posts;
}

const deleteUserPosts = async (
    userId
) => {
    if (!userId) throw 'You must provide a userId';
    if (typeof userId !== 'string') throw 'The userId must be a string';
    if (!ObjectId.isValid(userId)) throw 'The userId is not a valid ObjectId';

    const postsCollection = await posts();
    const userPosts = await postsCollection.find({ userId: userId }).toArray();
    
    // Delete comments for each post
    for (const post of userPosts) {
        await deletePostComments(post._id.toString());
    }

    // Then delete all the posts
    const deletionInfo = await postsCollection.deleteMany({ userId: userId });
    return { 
        postsDeleted: true, 
        deletedCount: deletionInfo.deletedCount,
        commentsDeleted: userPosts.length > 0
    };
}

const searchPosts = async (search) => {
    const allPosts = await getAllPosts();
    const options = {
	includeScore: true,
	keys: ['title', 'content']
    }

    const searchTerm = search;
    const fuse = new Fuse(allPosts, options)
    const searchResult = fuse.search(searchTerm);
    const filteredResult = searchResult.filter(result => result.score < 0.5);
    return filteredResult.map(result => result.item);
}

export { createPost, getPost, getAllPosts, getUserPosts, editPost, deletePost, deleteUserPosts, searchPosts };

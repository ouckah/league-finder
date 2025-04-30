import { users, posts } from '../config/mongoCollections.js';
import { getUser } from './users.js';
import { MongoNetworkTimeoutError, ObjectId } from 'mongodb';
import helpers from '../utils/helpers.js';

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
    if (typeof userId !== 'string') throw 'userId must be a string';
    if (!ObjectId.isValid(userId)) throw 'userId is not a valid ObjectId';
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (!user) throw 'User not found';

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
        image: image || '',
        title: title,
        content: content,
        tags: tags || [],
        createdAt: new Date()
    }

    const postsCollection = await posts();
    const insertInformation = await postsCollection.insertOne(post);
    if (!insertInformation) throw 'Could not add post';

    return { postCreated: true };
}

const getPost = async (
    postId,
) => {
    if (!postId) throw 'You must provide an id to search for';
    if (typeof postId !== 'string') throw 'The id must be a string';
    if (!ObjectId.isValid(postId)) throw 'The id is not a valid ObjectId';

    const postsCollection = await posts();
    const post = await postsCollection.findOne({ _id: ObjectId(postId) });
    if (!post) throw 'No post with that id';

    return post;
}

const getUserPosts = async (
    userId
) => {
    if (!userId) throw 'You must provide an id to search for';
    if (typeof userId !== 'string') throw 'The id must be a string';
    if (!ObjectId.isValid(userId)) throw 'The id is not a valid ObjectId';
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (!user) throw 'User does not exist.';

    const postsCollection = await posts();
    const posts = await postsCollection.find({ userId: ObjectId(userId) }).toArray();
    if (!posts) throw 'User has no posts';

    return posts;
}

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

    if (typeof postId !== 'string') throw 'The id must be a string';
    if (!ObjectId.isValid(postId)) throw 'The id is not a valid ObjectId';

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
            { _id: ObjectId(postId) },
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
    const deletionInfo = await postsCollection.deleteOne({ _id: ObjectId(postId) });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete post with id of ${postId}`;
    }

    return { postDeleted: true };
}

export { createPost, getPost, getUserPosts, editPost, deletePost };

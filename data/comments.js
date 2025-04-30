import {users, posts,comments} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';

const createComment = async (
    userId,
    postId,
    content
) => {
    if (!userId) throw 'You must provide a userId';
    if (!postId) throw 'You must provide a postId';
    if (!content) throw 'You must provide a content';
    
    const userCollection = await users();
    const postCollection = await posts();
    const user = await userCollection.findOne({_id: ObjectId(userId)});
    if (!user) throw 'User not found';

    const post = await postCollection.findOne({_id: ObjectId(postId)});
    if (!post) throw 'Post not found';

    const commentCollection = await comments();
    const newComment = {
        userId: userId,
        postId: postId,
        content: content,
        likes: 0,
        replies: [],
        createdAt: new Date().toUTCString()
    }
    
    const insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo.insertedId) {
        return await getComment(insertInfo.insertedId.toString());
    }
    throw 'Failed to create comment';
}   




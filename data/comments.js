import {users, posts,comments} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';

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
    const user = await userCollection.findOne({_id: new ObjectId(userId)});
    if (!user) throw 'User not found';

    const post = await postCollection.findOne({_id: new ObjectId(postId)});
    if (!post) throw 'Post not found';

    const commentCollection = await comments();
    const newComment = {
        userId: userId,
        postId: postId,
        content: content,
        createdAt: new Date().toUTCString(),
        username: user.username
    }
    
    const insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo.insertedId) {
        newComment._id = insertInfo.insertedId;
        return newComment;
    } else{
        throw 'Failed to create comment';
    }
}   

const deleteComment = async (
    commentId
) => {
    if (!commentId) throw 'You must provide a commentId';
    if (typeof commentId !== 'string') throw 'The commentId must be a string';
    if (!ObjectId.isValid(commentId)) throw 'The commentId is not a valid ObjectId';
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: new  ObjectId(commentId)});
    if (!comment) throw 'Comment not found';

    const deletionInfo = await commentCollection.deleteOne({_id: new ObjectId(commentId)});
    if (deletionInfo.deletedCount === 0) throw 'Failed to delete comment';
    return { commentDeleted: true };
}

const getPostComments = async (
    postId
) => {
    if (!postId) throw 'You must provide a postId';
    if (typeof postId !== 'string') throw 'The postId must be a string';
    if (!ObjectId.isValid(postId)) throw 'The postId is not a valid ObjectId';

    const commentCollection = await comments();
    let allComments = await commentCollection.find({postId: postId}).toArray();
    if (!allComments) throw 'No comments found';
    return allComments;
}

const deletePostComments = async (
    postId
) => {
    if (!postId) throw 'You must provide a postId';
    if (typeof postId !== 'string') throw 'The postId must be a string';
    if (!ObjectId.isValid(postId)) throw 'The postId is not a valid ObjectId';

    const commentCollection = await comments(); 
    const deletionInfo = await commentCollection.deleteMany({postId: postId});
    return { commentDeleted: true , deletedCount: deletionInfo.deletedCount };
}

const deleteUserComments = async (
    userId
) => {
    if (!userId) throw 'You must provide a userId';
    if (typeof userId !== 'string') throw 'The userId must be a string';
    if (!ObjectId.isValid(userId)) throw 'The userId is not a valid ObjectId';

    const commentCollection = await comments(); 
    const deletionInfo = await commentCollection.deleteMany({userId: userId});
    return { commentDeleted: true , deletedCount: deletionInfo.deletedCount };
}

export { createComment, deleteComment, getPostComments, deletePostComments, deleteUserComments };



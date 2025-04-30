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

const likeComment = async (
    commentId
) => {
    if (!commentId) throw 'You must provide a commentId';
    if (typeof commentId !== 'string') throw 'The commentId must be a string';
    if (!ObjectId.isValid(commentId)) throw 'The commentId is not a valid ObjectId';

    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: ObjectId(commentId)});
    if (!comment) throw 'Comment not found';

    const updatedComment = {
        likes: comment.likes + 1
    }

    const updateInfo = await commentCollection.updateOne(
        {_id: ObjectId(commentId)},
        {$set: updatedComment}
    );
    if (updateInfo.modifiedCount === 0) throw 'Failed to like comment';
    return { commentUpdated: true };
}

const replyToComment = async (
    commentId,
    content
) => {
    if (!commentId) throw 'You must provide a commentId';
    if (typeof commentId !== 'string') throw 'The commentId must be a string';
    if (!ObjectId.isValid(commentId)) throw 'The commentId is not a valid ObjectId';

    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: ObjectId(commentId)});
    if (!comment) throw 'Comment not found';

    if (!content) throw 'You must provide a content';
    if (typeof content !== 'string') throw 'The content must be a string';
    if (content.trim() === '') throw 'The content cannot be an empty string';

    const updatedComment = {
        replies: [...comment.replies, content]
    }

    const updateInfo = await commentCollection.updateOne(
        {_id: ObjectId(commentId)},
        {$set: updatedComment}
    );
    if (updateInfo.modifiedCount === 0) throw 'Failed to reply to comment';
    return { replyAdded: true };
}

const deleteComment = async (
    commentId
) => {
    if (!commentId) throw 'You must provide a commentId';
    if (typeof commentId !== 'string') throw 'The commentId must be a string';
    if (!ObjectId.isValid(commentId)) throw 'The commentId is not a valid ObjectId';
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: ObjectId(commentId)});
    if (!comment) throw 'Comment not found';

    const deletionInfo = await commentCollection.deleteOne({_id: ObjectId(commentId)});
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
    const comments = await commentCollection.find({postId: ObjectId(postId)}).toArray();
    if (!comments) throw 'No comments found';
    return comments;
}

export { createComment, likeComment, replyToComment, deleteComment, getPostComments };



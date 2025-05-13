import { createComment } from '../data/comments.js';

const comment1 = {
    content: "Faker's return is exactly what the scene needed! Can't wait to see him dominate again.",
}

const comment2 = {
    content: "I hope he's been practicing during his break. The competition has gotten even tougher!",
}

const comment3 = {
    content: "This is surprising news about Guma. He was performing well last season.",
}

const comment4 = {
    content: "Maybe this will give him time to reset and come back stronger. He's still young.",
}

const comment5 = {
    content: "Finally! Azir mains have been waiting for this buff for so long.",
}

const comment6 = {
    content: "The new changes look promising. His soldiers should be more impactful now.",
}

const comments = [
    comment1,
    comment2,
    comment3,
    comment4,
    comment5,
    comment6,
];

const seedComments = async (userIds, postIds) => {
    const n = userIds.length;
    let commentIds = [];
    let userIdIndex = 0;
    let postIdIndex = 0;

    for (const comment of comments) {
        // Create comment with rotating users and posts
        commentIds.push(await createComment(userIds[userIdIndex], postIds[postIdIndex], comment.content));
        
        userIdIndex = (userIdIndex + 1) % n;
        
        // Rotate through posts every 2 comments (since we have 2 comments per post)
        if (commentIds.length % 2 === 0) {
            postIdIndex = (postIdIndex+ 1) % postIds.length;
        }
    }
    return commentIds;
}

export { comments, seedComments };
import { createFriendRequest, friend } from '../data/friends.js';

// Person is friend with person next in array
const seedFriends = async (userIds) => {
    const n = userIds.length;
    let friendIds = [];

    // Create friend requests and accept them in a circular pattern
    for (let i = 0; i < n; i++) {
        const currentUserId = userIds[i];
        const nextUserId = userIds[(i + 1) % n]; 

        try {
            await createFriendRequest(currentUserId, nextUserId);
            await friend(nextUserId, currentUserId);
            friendIds.push({ from: currentUserId, to: nextUserId });
        } catch (e) {
            console.log(`Error creating friendship between ${currentUserId} and ${nextUserId}: ${e}`);
        }
    }
    
    return friendIds;
}

export { seedFriends };



import { createPost } from '../data/posts.js';

const post1 = {
    image: 'https://cdn.prod.website-files.com/64da5279f1559b26fb07550e/66fde3c9726f342d88d59985_T1%20Faker%20.jpg',
    title: 'Faker is back!',
    content: 'Faker is back in the game and ready to dominate the competition. After a brief hiatus, he has returned to prove that he is still one of the best players in the world.',
    tags: ['gaming', 'esports', 'faker'],
}

const post2 = {
    image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT8W0jj16TAWE5rs7E6frCKkN9-oSf6wKjcz84AE_cknTAs8gPfYvCJRBLIZeJ-cCMGi8DX75kkr-fPPnqNYiZ_eg',
    title: 'Gumayusi Benched',
    content: 'Gumayusi has been benched for the upcoming season due to performance issues. The team is looking for a new ADC to fill his spot.',
    tags: ['gaming', 'esports', 'gumayusi'],
}

const post3 = {
    image: 'https://static.wikia.nocookie.net/multiversology/images/f/f2/Azir_Base.jpg/revision/latest?cb=20210308181658',
    title: 'Azir Buffed',
    content: 'Azir has received a buff in the latest patch, making him a more viable pick in the current meta. Players are excited to see how this will affect his performance in the game.',
    tags: ['gaming', 'esports', 'azir'],
}

const posts = [
    post1,
    post2,
    post3,
];

const seedPosts = async (userIds) => {
    const uIdIndex = 0;
    const n = userIds.length;
    let postIds = [];
    for (const post of posts) {
	postIds.push(await createPost(userIds[uIdIndex], post.image, post.title, post.content, post.tags));
	if (uIdIndex >= n - 1) {
	    uIdIndex = 0;
	}
    }
    return postIds;
}

export { posts, seedPosts };


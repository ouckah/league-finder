import {users, teams, posts, comments} from '../config/mongoCollections.js';
import {seedUsers} from './users.js';
import {seedPosts} from './posts.js';
import { seedTeams } from './teams.js';
import { seedComments } from './comments.js';
import { closeConnection } from '../config/mongoConnection.js';

console.log("Dropping Posts");
const postCollection = await posts();
await postCollection.deleteMany({});

console.log("Dropping Comments");
const commentCollection = await comments();
await commentCollection.deleteMany({});

console.log("Dropping Users");
const userCollection = await users();
await userCollection.deleteMany({});

console.log("Dropping Teams");
const teamCollection = await teams();
await teamCollection.deleteMany({});

console.log("Seeding Users");
const userIds = await seedUsers();
console.log(userIds);

console.log("Seeding Posts");
const postIds = await seedPosts(userIds);
console.log(postIds);

console.log("Seeding Comments");
const commentIds = await seedComments(userIds, postIds);
console.log(commentIds);

console.log("Seeding Teams");
const teamIds = await seedTeams(userIds);
console.log(teamIds);

closeConnection();

console.log("DONE")

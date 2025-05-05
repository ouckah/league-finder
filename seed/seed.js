import {users, teams, posts} from '../config/mongoCollections.js';
import {seedUsers} from './users.js';
import {seedPosts} from './posts.js';
import { seedTeams } from './teams.js';
import { closeConnection } from '../config/mongoConnection.js';

console.log("Dropping Posts");
const postCollection = await posts();
await postCollection.deleteMany({});

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

console.log("Seeding Teams");
const teamIds = await seedTeams(userIds);
console.log(teamIds);

closeConnection();

console.log("DONE")

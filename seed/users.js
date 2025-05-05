import { createUser } from '../data/users.js';

const user1 = {
  firstName: "Alice",
  lastName: "Smith",
  email: "alice.smith@example.com",
  username: "alicesmith",
  password: "AliceSmith!1"
};

const user2 = {
  firstName: "Bob",
  lastName: "Johnson",
  email: "bob.johnson@example.com",
  username: "bobjohnson",
  password: "B0bJohnson@2"
};

const user3 = {
  firstName: "Carol",
  lastName: "Williams",
  email: "carol.williams@example.com",
  username: "carolwilliams",
  password: "CarolW!lliams3"
};

const user4 = {
  firstName: "David",
  lastName: "Brown",
  email: "david.brown@example.com",
  username: "davidbrown",
  password: "DavidBrow#4"
};

const user5 = {
  firstName: "Emma",
  lastName: "Jones",
  email: "emma.jones@example.com",
  username: "emmajones",
  password: "EmmaJones$5"
};

const users = [
  user1, user2, user3, user4, user5,
];

const seedUsers = async () => {
    const userIds = await Promise.all(users.map((user) => {return createUser(user.firstName, user.lastName, user.email, user.username, user.password)}));
    return userIds;
}

export { users, seedUsers }

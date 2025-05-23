import {dbConnection} from './mongoConnection.js';

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: 
NOTE: YOU WILL NEED TO CHANGE THE CODE BELOW AND UNCOMMENT IT TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT */

export const users = getCollectionFn('users');
export const posts = getCollectionFn('posts');
export const comments = getCollectionFn('comments');
export const friends = getCollectionFn('friends');
export const teamRequests = getCollectionFn('teamRequests');
export const teams = getCollectionFn('teams');
export const votes = getCollectionFn('votes');
export const pokes = getCollectionFn('pokes');

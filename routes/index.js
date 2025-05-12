import mainRoutes from './main.js';
import userRoutes from './users.js';
import postRoutes from './posts.js';
import commentRoutes from './comments.js';
import friendRoutes from './friends.js';
import teamRoutes from './teams.js';
import reputationRoutes from './reputation.js'

const constructorMethod = (app) => {
    app.use('/', mainRoutes);
    app.use('/users', userRoutes);
    app.use('/posts', postRoutes);
    app.use('/comments', commentRoutes);
    app.use('/friends', friendRoutes);
    app.use('/teams', teamRoutes);
    app.use('/reputation', reputationRoutes)
    app.use(/(.*)/, (req, res) => {
      res.sendStatus(404);
    });
  };
  
export default constructorMethod;

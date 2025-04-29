import mainRoutes from './main.js';
import userRoutes from './users.js';
import postRoutes from './posts.js';

const constructorMethod = (app) => {
    app.use('/', mainRoutes);
    app.use('/users', userRoutes);
    app.use('/posts', postRoutes);
    app.use(/(.*)/, (req, res) => {
      res.sendStatus(404);
    });
  };
  
export default constructorMethod;

import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import configRoutes from './routes/index.js';
import setupMiddleware from './utils/middleware.js';
import handlebarshelpers from './utils/handlebarshelpers.js';

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
    }
  
    next();
};

const app = express();

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  helpers: handlebarshelpers
}));

app.set('view engine', 'handlebars');

app.use(session({
     name: 'AuthenticationState',
     secret: 'Noo, oh, oh.. oh... La Polizia',
     resave: false,
     saveUninitialized: false
}))

// setup middleware
setupMiddleware(app);
configRoutes(app);

const PORT = 3000
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

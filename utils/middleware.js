// middleware

const setupMiddleware = (app) => {
  app.use(authMiddleware);
  app.use(logMiddleware);
}

function authMiddleware(req, res, next) {
  const user = req.session?.user || null;
  const isLoggedIn = !!user

  req.isLoggedIn = isLoggedIn
  res.locals.isLoggedIn = isLoggedIn
  res.locals.personalID = isLoggedIn ? user.userId : null;

  next();
}

export function protectedRoute(req, res, next) {
  const user = req.session?.user;
  if (!user) {
    return res.status(401).redirect('/users/login');
  }

  req.user = user;
  next();
}

function logMiddleware(req, res, next) {
  const currentTimestamp = new Date().toUTCString()
  const method = req.method
  const path = req.path

  const isLoggedIn = req.isLoggedIn

  console.log(`${currentTimestamp}: ${method} ${path} (${isLoggedIn ? "Authenticated User" : "Non-Authenticated"})`)
  next()
}

export default setupMiddleware;
// middleware

const setupMiddleware = (app) => {
  app.use(logMiddleware)
  app.use(authMiddleware)
}

function logMiddleware(req, res, next) {
  const currentTimestamp = new Date().toUTCString()
  const method = req.method
  const path = req.path

  const loggedIn = req.loggedIn

  console.log(`${currentTimestamp}: ${method} ${path} (${loggedIn ? "Authenticated User" : "Non-Authenticated"})`)
  next()
}

function authMiddleware(req, res, next) {
  const user = req.session?.user || null;
  const loggedIn = !!user

  req.loggedIn = loggedIn

  res.locals.loggedIn = loggedIn
  next()
}

export default setupMiddleware;
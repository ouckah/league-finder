// middleware

const setupMiddleware = (app) => {
  app.use(logMiddleware)
}

function logMiddleware(req, res, next) {
  const currentTimestamp = new Date().toUTCString()
  const method = req.method
  const path = req.path

  // const loggedIn = req.loggedIn
  // const isSuperUser = req.isSuperUser

  console.log(`${currentTimestamp}: ${method} ${path}`)
  // console.log(`${currentTimestamp}: ${method} ${path} (${loggedIn ? ("Authenticated " + isSuperUser ? "Super User" : "User") : "Non-Authenticated"})`)
  next()
}

export default setupMiddleware;
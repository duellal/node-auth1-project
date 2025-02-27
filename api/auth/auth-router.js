const authRouter = require(`express`).Router()
const Users = require(`../users/users-model`)
const bcrypt = require(`bcryptjs`)

// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const {checkUsernameFree, checkPasswordLength, checkUsernameExists} = require(`./auth-middleware`)

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

  authRouter.post(`/register`, checkUsernameFree, checkPasswordLength, (req, res, next) => {
    const {username, password} = req.body
    const hash = bcrypt.hashSync(password, 8)
    const newUser = {username, password: hash}

    Users.add(newUser)
      .then(user => {
        res.status(200).json(user)
      })
      .catch(next)
  })

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

  authRouter.post(`/login`, checkUsernameExists, (req, res, next) => {
    const {username, password} = req.body
    
    Users.findBy({username})
      .then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
          req.session.user = user
          res.json({
            message: `Welcome ${username}`
          })
        }
        else{
          next({
            status: 401,
            message: `Invalid credentials`
          })
        }
      })
    .catch(next)
  })

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

  authRouter.get(`/logout`, (req, res, next) => {
    if(req.session.user){
      req.session.destroy(err => {
        if(!err){
          res.set(`Set-Cookie`, `chocolatechip=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00`)

          res.json({
            message: `logged out`
          })
        }
        else{
          next(err)
        }
      })
    }
    else{
      res.json({
        message: `no session`
      })
    }
  })

 
module.exports = authRouter
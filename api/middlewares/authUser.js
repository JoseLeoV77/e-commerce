import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return res.status(403).send('Access not authorized')
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.user = data
    next()
  } catch (error) {
    return res.status(401).send('Access not authorized')
  }
}
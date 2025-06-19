import { Router } from "express";
import { UserController } from "../controller/users.js";
import { authenticateUser } from "../middlewares/authUser.js";
import { upload } from "../server/app.js";


export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()

  const userController = new UserController({ userModel })
  userRouter.get('/', userController.getAll)
  userRouter.get('/search', userController.getInput)
  userRouter.get('/protected', authenticateUser, userController.protected)

  userRouter.post('/login', userController.login)
  userRouter.post('/register', userController.register)
  userRouter.post('/logout', userController.logout)

  userRouter.get('/refreshToken', userController.refreshToken)

  userRouter.post('/update', userController.updateProduct)
  userRouter.post('/create', authenticateUser, upload.array('productImages', 5), userController.createProduct)
  userRouter.post('/delete', userController.deleteProduct)
  userRouter.get('/categories', userController.getCategories)
  userRouter.get('/user-products', authenticateUser, userController.getUserProducts)

  return userRouter
}
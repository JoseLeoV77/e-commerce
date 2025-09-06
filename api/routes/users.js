import { Router } from "express";
import { UserController } from "../controller/users.js";
import { authenticateUser } from "../middlewares/authUser.js";
import { uploadToSupabase } from "../middlewares/supabaseUpload.js";
import paypalAuth from "../middlewares/paypalAuth.js"
import upload from "../middlewares/multerSetup.js";


export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()

  const userController = new UserController({ userModel })

  userRouter.get('/', userController.getAll)
  userRouter.get('/search', userController.getInput)
  userRouter.get('/refreshToken', userController.refreshToken)
  userRouter.get('/categories', userController.getCategories)
  userRouter.get('/user-products', authenticateUser, userController.getUserProducts)
  userRouter.get('/protected', authenticateUser, userController.protected)
  userRouter.get('/products/:productSlug', userController.getProductyBySlug)


  userRouter.post('/login', userController.login)
  userRouter.post('/register', userController.register)
  userRouter.post('/logout', userController.logout)
  userRouter.post('/create-paypal-order', paypalAuth, userController.createPaypalOrder);
  userRouter.post('/capture-paypal-order/:orderId', paypalAuth, userController.capturePaypalOrder);
  userRouter.post('/update', userController.updateProduct)
  userRouter.post('/create', authenticateUser, upload.array('productImages', 5), uploadToSupabase, userController.createProduct)
  userRouter.post('/delete', userController.deleteProduct)

  return userRouter
}
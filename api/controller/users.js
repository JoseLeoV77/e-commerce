import { createOrder, captureOrder } from '../paypal/paypal.js'
import jwt from 'jsonwebtoken'
import crypto, { randomUUID } from 'node:crypto'
import 'dotenv/config'

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel
  }

  getAll = async (req, res) => {
    console.log('inside getAll')
    let users
    try {
      users = await this.userModel.getAll()
      res.json(users)
    } catch (error) {
      console.error('Error in getAll controller', error.message)
      res.status(500).json({ error: 'Failed to fetch users' })
    }
  }

  getInput = async (req, res) => {
    const { q, category } = req.query
    console.log('GetInput')
    try {
      if (!q) {
        return res.status(400).json({ error: "Missing query parameter" })
      }
      const input = await this.userModel.getInput({ q, category })
      res.json(input)
    } catch (error) {
      console.error('Error in getInput controller', error.message)
      res.status(500).json({ error: 'Failed to fetch input' })
    }
  }

  getProductyBySlug = async (req, res) => {
    const { productSlug } = req.params
    console.log('productSlug in controller', productSlug)
    try {
      if (!productSlug) {
        return res.status(400).json({ error: "Missing product name" })
      }
      const product = await this.userModel.getProductBySlug({ productSlug })

      if (!product) {
        res.status(404).json({ error: "Product not found" })
      }

      res.status(200).json(product)
    } catch (error) {
      console.error('Error in getProductByName controller', error.message)
    }
  }

  getCategories = async (req, res) => {
    console.log("hello?")
    try {
      const categories = await this.userModel.getCategories()
      console.log("inside cate")
      res.json(categories)
    } catch (error) {
      console.error('Error getting the categories', error)
      res.status(500).json({ error: 'Failed to fetch categories' })
    }
  }

  login = async (req, res) => {
    const { user_name, password } = req.body
    if (!user_name || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    try {
      const user = await this.userModel.login({ user_name, password })
      //process.env.
      if (!user) {
        console.log('inside here')
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // const session = await this.userModel.createSession({ user_id: user.user_id })
      // const sessionId = session.session_id

      // const accessToken = jwt.sign({ user_id: user.user_id, username: user_name, sid: sessionId }, process.env.JWT_SECRET, { expiresIn: "2h" })

      const accessToken = jwt.sign({ user_id: user.user_id, username: user_name }, process.env.JWT_SECRET, { expiresIn: "2h" })

      // const refreshToken = jwt.sign({ user_id: user.user_id, username: user_name, sid: sessionId }, process.env.REFRESH_SECRET, { expiresIn: "7d" })

      const refreshToken = jwt.sign({ user_id: user.user_id, username: user_name }, process.env.REFRESH_SECRET, { expiresIn: "7d" })

      const regreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true, //cannot be acccessed by Js
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        sameSite: 'Strict'
      })

      return res.json({ user_name, accessToken })
    } catch (error) {
      console.error('Error in login', error.message)
      res.status(500).json({ error: 'Internal server error ocurred! ' })
    }
  }

  register = async (req, res) => {
    const { user_name, password, email } = req.body
    console.log('query', req.body)

    if (!user_name || !password || !email) return res.status(400).json({ error: "Missing required fields" })

    try {
      const registerUser = await this.userModel.register({ user_name, password, email })
      res.status(201).json(registerUser)
    } catch (error) {

      res.status(400).send(error.message)
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Email or username already exists" });
      }

      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  logout = async (req, res) => {
    console.log('inside logout')
    res.clearCookie('refresh_token');
    res.status(200).json({ message: 'Logged out successfully' })
  }

  createProduct = async (req, res) => {
    const { productName, productDescription, productPrice, category } = req.body
    console.log('req.body', req.body)
    if (!productName || !productPrice) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const imageUrls = req.imagePaths;

    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ error: "No images uploaded" })
    }

    try {
      await this.userModel.createProduct({
        productName,
        productDescription,
        productPrice: Number(productPrice),
        productImages: imageUrls,
        category,
        userId: req.user.user_id
      })
      res.status(201).json({ message: "Product created successfully" })
    } catch (error) {
      console.log(" Error creating product: ", error)
    }
  }

  updateProduct = async (req, res) => {
    console.log("Update Product")
  }

  deleteProduct = async (req, res) => {
    console.log("Delete Product")
  }

  refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token found" })
    }
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh Token" })
      }

      const newAccessToken = jwt.sign({ user_id: user.user_id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "2h" });

      const newRefreshToken = jwt.sign({ user_id: user.user_id, username: user.username }, process.env.REFRESH_SECRET, { expiresIn: "7d" })

      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "Strict"
      })

      res.json({ accessToken: newAccessToken })
    })
  }

  getUserProducts = async (req, res) => {
    const { user_id } = req.user
    try {
      const userProducts = await this.userModel.getUserProducts({ userId: user_id })
      res.json({ message: 'User products fetched successfully', products: userProducts })
    } catch (error) {
      console.error('Error fetching user products', error.message)
      return res.status(500).json({ error: 'Failed to fetch user products' })
    }
  }


  protected = async (req, res) => {
    console.log('inside protected', req.user)
    res.json({ message: 'Protected route accessed', user: req.user })
    //This route is just to display user info.
  }

  createPaypalOrder = async (req, res) => {
    try {
      console.log("Back", req.body)
      const seller = req.user
      const { cart } = req.body;
      console.log("Cart.items: ", cart.items)
      console.log("lets see more than 1 cart item")
      console.log(seller)

      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({ error: "Missing cart information!" });
      }

      const { jsonResponse, httpStatusCode } = await createOrder(cart, seller);

      if (httpStatusCode >= 200 && httpStatusCode < 300) {
        const paypalOrderId = jsonResponse.id
        const initialValue = 0

        const internalOrderId = randomUUID()

        const cartTotalPrice = cart.items.reduce((accumulator, currentValue) => accumulator + Number(currentValue.price), initialValue)
        console.log('before create, order', internalOrderId)
        await this.userModel.createOrder({ orderId: internalOrderId, userId: seller.user_id, totalPrice: cartTotalPrice, paypalOrderId: paypalOrderId, status: "PENDING" })

        await this.userModel.createOrderItems({
          orderId: internalOrderId,
          items: cart.items
        })

        res.status(httpStatusCode).json({ ...jsonResponse, internalOrderId });
      } else {
        res.status(httpStatusCode).json(jsonResponse);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }
  }


  capturePaypalOrder = async (req, res) => {
    try {
      const seller = req.user;
      const { orderId } = req.params;
      console.log('capture, seller', seller)
      console.log("inside capturePaypalOrder ORDERID", orderId)
      const internalOrder = await this.userModel.findByPaypalId({ paypalId: orderId });
      if (!internalOrder) {
        return res.status(404).json({ error: "Order not found." });
      }
      console.log("INTERNAL ORDER: ", internalOrder)
      const isOrderOwner = await this.userModel.verifyOrderOwnership({ orderId: orderId, userId: seller.user_id });

      if (!isOrderOwner) {
        return res.status(403).json({ error: "Forbidden: You are not authorized to capture this order." });
      }
      const { jsonResponse, httpStatusCode } = await captureOrder(orderId);

      if (httpStatusCode >= 200 && httpStatusCode < 300 && jsonResponse.status === 'COMPLETED') {

        const capture = jsonResponse.purchase_units[0].payments.captures[0];
        console.log("Captured Order Details:", capture)

        const transactionDetails = {
          transaction_id: capture.id,
          order_id: internalOrder.order_id,
          payment_status: jsonResponse.status,
          amount_paid: capture.seller_receivable_breakdown.gross_amount.value,
          currency_code: capture.seller_receivable_breakdown.gross_amount.currency_code,
          paypal_fee: capture.seller_receivable_breakdown.paypal_fee.value,
          transaction_created_at: capture.create_time,
        }

        await this.userModel.createTransaction({ transactionDetails });

        const orderItems = await this.userModel.getOrderItems({ orderId: internalOrder.order_id });
        console.log("ORDER ITEMS: ", orderItems)

        for (const item of orderItems) {
          await this.userModel.updateProductStock({
            productId: item.product_id,
            quantity: item.quantity
          })
        }

        await this.userModel.updateStatus({ orderId: internalOrder.order_id });
        console.log("Order captured successfully:", jsonResponse);
      }

      res.status(httpStatusCode).json(jsonResponse);

    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to capture order." });
    }
  }



}



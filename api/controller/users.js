import jwt from 'jsonwebtoken'
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

  getCategories = async (req, res) => {
    try {
      const categories = await this.userModel.getCategories()
      res.json(categories)
    } catch (error) {
      console.error('Error getting the categories', error)
      res.status(500).json({ error: 'Failed to fetch categories' })
    }
  }

  login = async (req, res) => {
    const { user_name, password } = req.body
    if (!user_name || !password) {
      return res.status(400).json({ error: 'Mssing required fields' })
    }
    try {
      const user = await this.userModel.login({ user_name, password })
      //process.env.
      if (!user) {
        console.log('inside here')
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const accessToken = jwt.sign({ user_id: user.user_id, username: user_name }, process.env.JWT_SECRET, { expiresIn: "2h" })

      const refreshToken = jwt.sign({ user_id: user.user_id, username: user_name }, process.env.REFRESH_SECRET, { expiresIn: "7d" })

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        sameSite: 'Strict'
      })

      return res.json({ user_name, accessToken })
    } catch (error) {
      console.error('Error in login', error.message)
      res.status(500).json({ error: 'Failed to login' })
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
    if (!req.files) {
      return res.status(400).json({ error: "No files uploaded" })
    }
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`)
    console.log("Image paths: ", imagePaths)
    try {
      await this.userModel.createProduct({
        productName,
        productDescription,
        productPrice: Number(productPrice),
        productImages: imagePaths,
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


}

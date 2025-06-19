//model with mysql
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'

export class UserModel {
  constructor(config) {
    this.db = config
  }

  async getAll() {
    try {
      const [rows] = await this.db.query(`SELECT BIN_TO_UUID(products.product_id) AS product_id, 
      products.product_name, 
      products.product_description,
      products.price,
      products.discounted_price,
      categories.category_name, 
      products.stock_quantity,
      product_images.image_url 
      FROM products 
      LEFT JOIN categories ON products.category_id = categories.category_id
      LEFT JOIN product_images ON products.product_id = product_images.product_id`)
      return rows
    } catch (error) {
      console.error('Error fetching all products: ', error)
      throw new Error('Database error: Failed to retrieve products')
    }
  }

  async getInput({ q, category }) {
    let sql = `SELECT BIN_TO_UUID(products.product_id) AS product_id, 
    products.product_name, 
    categories.category_name, 
    products.stock_quantity,
    product_images.image_url 
    FROM products 
    LEFT JOIN categories ON products.category_id = categories.category_id
    LEFT JOIN product_images ON products.product_id = product_images.product_id`


    let params = []

    if (q && q.trim() !== "") {
      sql += ` WHERE products.product_name LIKE CONCAT('%', ?, '%') OR categories.category_name LIKE CONCAT('%', ?, '%')`;
      params.push(q, q);
    }


    if (category && category !== 'All') {
      sql += ` OR categories.category_name = ?`
      params.push(category)
    }
    const [rows] = await this.db.query(sql, params)
    console.log('rows in model', rows)
    return rows
  }

  async getCategories() {
    const [rows] = await this.db.query(
      'SELECT category_name FROM categories')
    return rows
  }

  async login({ user_name, password }) {
    console.log('model', user_name, password)
    try {
      const [user] = await this.db.query('SELECT BIN_TO_UUID(user_id) AS user_id, user_name, user_password FROM users WHERE user_name = ? AND user_password = ?', [user_name, password])
      console.log('user in model: ', user)
      //const isValid = await bcrypt.compare(password, user[0].user_password) //not done yet
      return user.length > 0 ? user[0] : null
    } catch (error) {
      console.error('Error fetching user: ', error)
      throw new Error('Database error: Failed to retrieve user')
    }
  }

  async register({ user_name, password, email }) {
    try {
      const [existingEmail] = await this.db.query('SELECT * FROM users WHERE email = ?', [email])

      if (existingEmail.length > 0) {
        throw new Error('Email already exists')
      }

      const newUserId = randomUUID()
      const hashedPasswword = await bcrypt.hash(password, 10)

      const [result] = await this.db.query('INSERT INTO users (user_id, user_name, user_password, email) VALUES (UUID_TO_BIN(?), ?, ?, ?)', [newUserId, user_name, hashedPasswword, email])
      return result
    } catch (error) {
      console.error('Error registering user: ', error)
      throw new Error('Database error: Failed to register user')
    }
  }

  async createProduct({ productName, productDescription, productPrice, productImages, category, userId }) {
    const productId = randomUUID()
    const [user] = await this.db.query(`SELECT 
    BIN_TO_UUID(user_id) AS user_id,
    user_name,
    email
    FROM users
    WHERE user_id = UUID_TO_BIN(?);`, [userId])

    if (!user.length) {
      throw new Error('User not found')
    }

    if (!productImages.length) {
      throw new Error('No images uploaded for the product');
    }

    const [categoryData] = await this.db.query(`SELECT BIN_TO_UUID(category_id) AS category_id FROM categories WHERE category_name = ?`, [category])

    if (!categoryData.length) {
      return { success: false, error: "Invalid category: Category not found" };
    }

    const categoryId = categoryData[0].category_id

    await this.db.beginTransaction()
    try {
      await this.db.query(`INSERT INTO products (product_id, product_name, product_description, category_id, price, user_id) VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), ?, UUID_TO_BIN(?))`, [productId, productName, productDescription, categoryId, productPrice, userId])

      await Promise.all(productImages.map(async (imagePath) => {
        await this.db.query(`
            INSERT INTO product_images (image_id, product_id, image_url)
            VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?)`, [productId, imagePath]);
      }));

      await this.db.commit()
      return { success: true, message: 'Product created successfully' }
    } catch (error) {
      await this.db.rollback()
      console.error('Error creating product: ', error)
      return { success: false, error: 'Database error: Failed to create product' }
    }
  }

  async getUserProducts({ userId }) {
    console.log('Getting user products for userId:', userId)
    try {
      const [rows] = await this.db.query(`SELECT 
      BIN_TO_UUID(products.product_id) AS product_id, 
      products.product_name, 
      products.product_description,
      products.price,
      products.discounted_price,
      categories.category_name, 
      products.stock_quantity, 
      product_images.image_url,
      BIN_TO_UUID(users.user_id) AS user_id
      FROM products 
      JOIN categories ON products.category_id = categories.category_id
      JOIN product_images ON products.product_id = product_images.product_id
      JOIN users ON products.user_id = users.user_id
      WHERE users.user_id = UUID_TO_BIN(?)`, [userId])
      console.log(rows)
      return rows
    } catch (error) {
      console.error('Error fetching user products: ', error)
      throw new Error('Database error: Failed to retrieve user products')
    }
  }

  async logout({ q }) {
    console.log(q)
  }

  async protected({ q }) {
    console.log('inside protected', q)
  }
}
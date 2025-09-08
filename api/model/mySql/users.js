//model with mysql
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import slugify from 'slugify'

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10

export class UserModel {
  constructor(dbPool) {
    this.db = dbPool
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

    console.log('query', q)
    let sql = `SELECT BIN_TO_UUID(products.product_id) AS product_id, 
    products.product_name, 
    products.slug,
    products.stock_quantity,
    products.price, 
    categories.category_name, 
    product_images.image_url
    FROM products 
    LEFT JOIN categories ON products.category_id = categories.category_id
    LEFT JOIN product_images ON products.product_id = product_images.product_id`


    let params = []
    let whereClauses = [];

    if (q && q.trim() !== "") {
      whereClauses.push(`(products.product_name LIKE ? OR categories.category_name LIKE ?)`);
      params.push(`%${q}%`, `%${q}%`);
    }

    if (category && category !== 'All') {
      whereClauses.push(`categories.category_name = ?`);
      params.push(category);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    sql += ` GROUP BY products.product_id, products.product_name, products.slug, products.stock_quantity, products.price, categories.category_name, product_images.image_url`;

    const [rows] = await this.db.query(sql, params)
    console.log('rows in model', rows)
    return rows
  }

  async getProductBySlug({ productSlug }) {
    console.log('productName in model', productSlug)

    const [rows] = await this.db.query(`SELECT BIN_TO_UUID(products.product_id) AS product_id, 
    products.product_name, 
    products.product_description,
    products.slug,
    products.stock_quantity,
    products.price, 
    BIN_TO_UUID(products.user_id) AS user_id,
    users.user_name,
    categories.category_name, 
    product_images.image_url
    FROM products 
    LEFT JOIN users ON products.user_id = users.user_id
    LEFT JOIN categories ON products.category_id = categories.category_id
    LEFT JOIN product_images ON products.product_id = product_images.product_id WHERE products.slug = ?`, [productSlug])

    console.log(rows[0])

    return rows.length > 0 ? rows[0] : null
  }

  async getCategories() {
    console.log("hellow?, getting categories")
    const [rows] = await this.db.query(
      'SELECT category_name FROM categories')
    console.log(rows)
    return rows
  }

  async login({ user_name, password }) {
    console.log('model', user_name, password)
    try {
      const [user] = await this.db.query('SELECT BIN_TO_UUID(user_id) AS user_id, user_name FROM users WHERE user_name = ?', [user_name])
      console.log('user in model: ', user)

      const hashedPasswordFromDb = user[0].user_password
      const isValid = await bcrypt.compare(password, hashedPasswordFromDb)

      if (!isValid) throw new Error('Invalid password')

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
      const hashedPasswword = await bcrypt.hash(password, SALT_ROUNDS)

      const [result] = await this.db.query('INSERT INTO users (user_id, user_name, user_password, email) VALUES (UUID_TO_BIN(?), ?, ?, ?)', [newUserId, user_name, hashedPasswword, email])
      return result
    } catch (error) {
      console.error('Error registering user: ', error)
      throw new Error('Database error: Failed to register user')
    }
  }

  async createProduct({ productName, productDescription, productPrice, productImages, category, userId }) {

    const productId = randomUUID()
    const baseSlug = slugify(productName, { lower: true, strict: true })
    const uniqueSlug = `${baseSlug}-${randomUUID().slice(0, 8)}`

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

    let connection
    try {
      connection = await this.db.getConnection()
      await connection.beginTransaction()

      const [result] = await connection.query(`INSERT INTO products (product_id, product_name, slug, product_description, category_id, price, user_id) VALUES (UUID_TO_BIN(?), ?, ?, ?, UUID_TO_BIN(?), ?, UUID_TO_BIN(?))`, [productId, productName, uniqueSlug, productDescription, categoryId, productPrice, userId])

      if (result.affectedRows === 0) {
        throw new Error('Failed to create product');
      }

      const imageInsertPromises = productImages.map(async (imagePath) => {
        await connection.query(`
          INSERT INTO product_images (image_id, product_id, image_url)
          VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?)`, [productId, imagePath]);
      });

      await Promise.all(imageInsertPromises);

      await connection.commit()
      return { success: true, message: 'Product created successfully' }
    } catch (error) {
      if (connection) {
        await connection.rollback()
      }
      console.error('Error creating product: ', error)
      return { success: false, error: 'Database error: Failed to create product' }
    } finally {
      if (connection) connection.release()
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

  async createPaypalOrder({ token, value }) {
    console.log('cO', token, value)
  }

  async findById({ userId }) {
    try {
      const [rows] = await this.db.query(`SELECT BIN_TO_UUID(user_id) AS user_id, paypal_email FROM users WHERE user_id = UUID_TO_BIN(?)`, [userId])
      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.error('Error fetching user by ID: ', error)
      throw new Error('Database error: Failed to retrieve user by ID')
    }
  }

  async findByPaypalId({ paypalId }) {
    try {
      const [rows] = await this.db.query(`SELECT BIN_TO_UUID(order_id) AS order_id, BIN_TO_UUID(user_id) AS user_id, paypal_order_id, total_price, status, created_at FROM orders WHERE paypal_order_id = ?`, [paypalId])
      return rows.length > 0 ? rows[0] : null
    } catch (error) {
      console.error('Error fetching user by PayPal ID: ', error)
      throw new Error('Database error: Failed to retrieve order by PayPal ID')
    }
  }

  async updateStatus({ orderId }) {
    try {
      const [result] = await this.db.query(`UPDATE orders SET status = 'completed' WHERE order_id = UUID_TO_BIN(?)`, [orderId])
      return result.affectedRows > 0
    } catch (error) {
      console.error('Error updating order status: ', error)
      throw new Error('Database error: Failed to update order status')
    }
  }

  async updateProductStock({ productId, quantity }) {
    try {
      const [result] = await this.db.query(`UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = UUID_TO_BIN(?)`, [quantity, productId])
      return result.affectedRows > 0
    } catch (error) {
      console.error('Error updating product stock: ', error)
      throw new Error('Database error: Failed to update product stock')
    }
  }

  async createTransaction({ transactionDetails }) {
    try {
      const { transaction_id, order_id, payment_status, amount_paid, currency_code, paypal_fee, transaction_created_at } = transactionDetails;

      const dateObj = new Date(transaction_created_at)
      const mysqlFormattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');

      await this.db.query(`INSERT INTO transactions (transaction_id, order_id, payment_status, amount_paid, currency_code, paypal_fee, transaction_created_at) VALUES (?, UUID_TO_BIN(?), ?, ?, ?, ?, ?)`, [transaction_id, order_id, payment_status, amount_paid, currency_code, paypal_fee, mysqlFormattedDate]);
    } catch (error) {
      console.error('Error creating transaction: ', error);
      throw new Error('Database error: Failed to create transaction');
    }
  }

  async verifyOrderOwnership({ orderId, userId }) {
    console.log(orderId, userId)
    try {
      const [rows] = await this.db.query(
        `SELECT BIN_TO_UUID(user_id) as user_id FROM orders WHERE paypal_order_id = ?`,
        [orderId]
      );

      if (rows.length === 0) {
        return false;
      }
      console.log(rows)

      const order = rows[0];
      const orderUserId = order.user_id
      // const orderUserId = Buffer.from(order.user_id).toString('hex');
      // const loggedInUserId = Buffer.from(userId).toString('hex');

      return orderUserId === userId;
    } catch (error) {
      console.error('Error verifying order ownership: ', error);
      throw new Error('Database error: Failed to verify order ownership');
    }
  }

  async createOrder({ orderId, userId, paypalOrderId, totalPrice, status }) {
    try {
      const [result] = await this.db.query(`INSERT INTO orders(order_id, user_id, paypal_order_id, total_price, status) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?)`, [orderId, userId, paypalOrderId, totalPrice, status])

      console.log("Order created in DB. Affected rows:", result.affectedRows);
      return result.affectedRows > 0;
    } catch (err) {
      console.log(err)
      throw new Error("Database erro: Failed to create Order")
    }
  }

  async getOrderItems({ orderId }) {
    try {
      const [rows] = await this.db.query(`SELECT BIN_TO_UUID(order_item_id) AS order_item_id, BIN_TO_UUID(order_id) AS order_id, BIN_TO_UUID(product_id) AS product_id, quantity, price_at_purchase FROM order_items WHERE order_id = UUID_TO_BIN(?)`, [orderId]);
      return rows;
    } catch (error) {
      console.error('Error fetching order items: ', error);
      throw new Error('Database error: Failed to retrieve order items');
    }
  }

  async createOrderItems({ orderId, items }) {

    try {
      if (!items || items.length === 0) {
        console.error("No items provided for order:", orderId);
        return;
      }

      const values = items.map(item => [
        orderId,
        item.id,
        item.quantity,
        item.price
      ]);

      const sql = `
            INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
            VALUES ${values.map(() => '(UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)').join(', ')}
        `;

      const flatValues = values.flat();

      await this.db.query(sql, flatValues);
      console.log(`Successfully created ${items.length} order items for order ${orderId}`);
    } catch (error) {
      console.error('Error creating order items: ', error);
      throw new Error('Database error: Failed to create order items.');
    }
  }
}
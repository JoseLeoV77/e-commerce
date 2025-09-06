import mysql from 'mysql2/promise';
import slugify from 'slugify';
import { config } from './config/database.js';
import { randomUUID } from 'crypto';

async function migrateSlug() {
  let connection;

  try {
    connection = await mysql.createConnection(config)
    console.log('connected')

    const [rows] = await connection.execute(`SELECT BIN_TO_UUID(product_id) AS product_id, product_name FROM products WHERE slug IS NULL`)

    if (rows.length === 0) {
      return
    }

    for (const row of rows) {
      console.log(row)

      const slug = slugify(row.product_name, {
        lower: true,
        strict: true
      })

      const uniqueSlug = `${slug}-${row.product_id.slice(0, 8)}`

      await connection.execute(`UPDATE products SET slug = ? WHERE product_id = UUID_TO_BIN(?)`, [uniqueSlug, row.product_id])
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

migrateSlug()
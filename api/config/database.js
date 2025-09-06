import { __filename, __dirname } from '../constants/constants.js'
import path from 'path'
import dotenv from 'dotenv'
// Corrected import statement for dotenv
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'e_commerce_db',
};
import express, { json } from 'express'
import { createUserRouter } from '../routes/users.js'
import { UserModel } from '../model/mySql/users.js'
import { config } from '../config/database.js'
import { fileURLToPath } from 'url'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mysql from 'mysql2/promise'
import path from 'path'
import mime from 'mime-types'
import multer from 'multer'

const connection = await mysql.createConnection(config)

const userModel = new UserModel(connection)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.PORT ?? 3000
const app = express()

const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Keeps original filename with extension
  }
});

export const upload = multer({ storage });

app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    const mimeType = mime.lookup(path)
    if (mimeType && mimeType.startsWith('image')) {
      res.set('Content-Type', mimeType)
      res.set('Content-Disposition', "inline")
    }
  }
}))
app.disable('x-powered-by') //Por seguridad y para dar menos info, deshabilitar el header de express. 
app.use(json())
app.use(cors({
  origin: 'http://localhost:5173', // Cambia esto a la URL de tu frontend
  credentials: true, // Permitir cookies y credenciales
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
})) //Arreglar esto despues, dejo cors solo para testing.

app.use('/', createUserRouter({ userModel }))

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})


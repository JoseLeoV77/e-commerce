import path from 'path'
import { __filename, __dirname } from '../constants/constants.js'
import express, { json } from 'express'
import { createUserRouter } from '../routes/users.js'
import { UserModel } from '../model/mySql/users.js'
import { config } from '../config/database.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mysql from 'mysql2/promise'

const init = async () => {
  const pool = mysql.createPool(config)
  const userModel = new UserModel(pool)

  const port = process.env.PORT ?? 3000
  const app = express()

  app.use(cookieParser())

  app.disable('x-powered-by') //Por seguridad y para dar menos info, deshabilitar el header de express. 
  app.use(json())
  app.use(cors({
    origin: 'http://localhost:5173', // Cambia esto a la URL de tu frontend
    credentials: true, // Permitir cookies y credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })) //Arreglar esto despues, dejo cors solo para testing.

  app.use('/', createUserRouter({ userModel }))

  app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  })
}

init()


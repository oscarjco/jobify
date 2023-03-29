import express from "express"
const authRouter = express.Router()

import authenticateUser from '../middleware/auth.js'

import { register, login, updateUser } from "../controller/authController.js"

authRouter.route('/register')
    .post(register)
authRouter.route('/login')
    .post(login)
authRouter.route('/update-user')
    .patch(authenticateUser, updateUser)

export default authRouter
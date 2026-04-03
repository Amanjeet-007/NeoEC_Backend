import express from 'express'
import adminController from '../controller/adminController.js'
import { isAdmin } from '../middleware/varifyAdmin.js'

const adminRoute = express.Router()

adminRoute.get('/getuser',isAdmin,adminController)

export default adminRoute
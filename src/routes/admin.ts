import { Router } from 'express'

//controllers
import { getAllAdmins } from '../controllers/admin'

const router = Router()

router.get('/', getAllAdmins)

export default router

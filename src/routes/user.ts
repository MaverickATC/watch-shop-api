import { Router } from 'express'

//controllers
import { getAllUsers } from '../controllers/user'

const router = Router()

router.get('/', getAllUsers)

export default router

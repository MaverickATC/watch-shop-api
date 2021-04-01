import { Router } from 'express'

//controllers
import { getAllOrders } from '../controllers/order'

const router = Router()

router.get('/', getAllOrders)

export default router

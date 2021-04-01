import { Router } from 'express'

//controllers
import { getAllSpecs } from '../controllers/spec'

const router = Router()

router.get('/', getAllSpecs)

export default router

import { Router } from 'express'

//controllers
import { getAllModifications } from '../controllers/modification'

const router = Router()

router.get('/', getAllModifications)

export default router

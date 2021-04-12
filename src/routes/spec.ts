import { Router } from 'express'

//controllers
import { createSpecs, getAllSpecs } from '../controllers/spec'
import { validateAdmin, validateAdminRole } from '../middleware/auth'

const router = Router()

router.get('/',validateAdmin,validateAdminRole('admin','manager'), getAllSpecs)
router.post('/:id',validateAdmin,validateAdminRole('admin','manager'), createSpecs)

export default router

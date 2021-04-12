import { Router } from 'express'

//middleware
import { validateAdmin, validateAdminRole } from '../middleware/auth'

//controllers
import {
  archiveProduct,
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct, unArchiveProduct,
  updateProduct,
} from '../controllers/product'

const router = Router()

//for all
router.get('/', getAllProducts)
router.get('/:id', getProduct)

//auth protected
router.post('/create', validateAdmin, validateAdminRole('admin', 'manager'), createProduct)
router.put('/update/:id', validateAdmin, validateAdminRole('admin', 'manager'), updateProduct)
router.put('/archive/:id', validateAdmin, validateAdminRole('admin', 'manager'), archiveProduct)
router.put('/unarchive/:id', validateAdmin, validateAdminRole('admin', 'manager'), unArchiveProduct)
router.delete('/:id', validateAdmin,validateAdminRole('admin'), deleteProduct)

export default router

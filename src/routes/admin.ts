import { Router } from 'express'

//controllers
import {
  getAllAdmins,
  createAdmin,
  loginAdmin,
  logoutAdmin,
  forgotPasswordAdmin,
  resetPasswordAdmin, changePasswordAdmin, suspendAdmin, activateAdmin, deleteAdmin,
} from '../controllers/admin'
import { validateAdmin, validateAdminRole } from '../middleware/auth'

const router = Router()

router.get('/', validateAdmin, getAllAdmins)
router.post('/create', validateAdmin, validateAdminRole('admin'), createAdmin)
router.post('/login', loginAdmin)
router.get('/logout', logoutAdmin)
router.post('/password/forgot', forgotPasswordAdmin)
router.post('/password/reset', resetPasswordAdmin)
router.put('/password/change/:id', changePasswordAdmin)
router.put('/suspend/:id', validateAdmin, validateAdminRole('admin'), suspendAdmin)
router.put('/activate/:id', validateAdmin, validateAdminRole('admin'), activateAdmin)
router.delete('/:id', validateAdmin, validateAdminRole('admin'), deleteAdmin)

export default router

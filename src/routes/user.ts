import { Router } from 'express'

//controllers
import {
  activateUser,
  changePasswordUser,
  createUser, deleteUser,
  forgotPasswordUser,
  getAllUsers, getUser,
  loginUser,
  logoutUser,
  resetPasswordUser, suspendUser,
} from '../controllers/user'

//middleware
import { validateAdmin, validateAdminRole } from '../middleware/auth'

const router = Router()

router.get('/',validateAdmin,validateAdminRole('admin', 'manager'), getAllUsers)
router.get('/:id', validateAdmin, validateAdminRole('admin', 'manager'), getUser)
router.post('/create', createUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)
router.post('/password/forgot', forgotPasswordUser)
router.post('/password/reset', resetPasswordUser)
router.put('/password/change/:id', changePasswordUser)
router.put('/suspend/:id', validateAdmin, validateAdminRole('admin'), suspendUser)
router.put('/activate/:id', validateAdmin, validateAdminRole('admin'), activateUser)
router.delete('/:id', validateAdmin, validateAdminRole('admin'), deleteUser)


export default router

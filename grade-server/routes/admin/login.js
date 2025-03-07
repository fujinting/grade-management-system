'use strict';

import express from 'express'
import AdminLoginReset from '../../controller/admin/login-reset.js'
const router = express.Router()

// 后台管理系统登录
router.post('/login', AdminLoginReset.adminLogin);
router.post('/register', AdminLoginReset.adminRegister);




export default router

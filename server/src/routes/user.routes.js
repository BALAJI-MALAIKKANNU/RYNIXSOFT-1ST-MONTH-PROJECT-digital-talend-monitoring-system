const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, userController.getAllUsers);
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.post('/avatar', verifyToken, userController.updateAvatar);

router.put('/:id/role', verifyToken, userController.updateUserRole);

module.exports = router;

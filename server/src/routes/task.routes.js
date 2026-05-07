const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const verifyToken = require('../middleware/verifyToken');



router.post('/', verifyToken, taskController.createTask);
router.get('/', verifyToken, taskController.getTasks);
router.put('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, taskController.deleteTask);
router.post('/:id/submit', verifyToken, taskController.submitTask);

module.exports = router;

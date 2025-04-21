const express = require('express');
const {
  authAdmin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authAdmin);
router.get('/users', protectAdmin, getUsers);
router.get('/users/:id', protectAdmin, getUserById);
router.put('/users/:id', protectAdmin, updateUser);
router.delete('/users/:id', protectAdmin, deleteUser);

module.exports = router;
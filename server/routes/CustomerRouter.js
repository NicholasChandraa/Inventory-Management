const express = require('express');
const router = express.Router();
const {getAllCustomers, addCustomer, getCustomerTypes, addCustomerType, deleteCustomerType, updateCustomer, getOneCustomer, deleteCustomer} = require('../controllers/CustomerController');
const { authMiddleware, adminCheck } = require("../middleware/authMiddleware");

router.get('/customer-types', authMiddleware, getCustomerTypes);
router.post('/customer-types', authMiddleware, addCustomerType);
router.delete('/customer-types/:id', authMiddleware, deleteCustomerType);

router.get('/', authMiddleware, getAllCustomers);
router.get('/:id', authMiddleware, getOneCustomer);
router.post('/', authMiddleware, addCustomer);
router.put('/:id', authMiddleware, updateCustomer);
router.delete('/:id', authMiddleware, deleteCustomer);

module.exports = router;
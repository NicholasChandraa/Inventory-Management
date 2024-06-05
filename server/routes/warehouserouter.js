const express = require('express');
const router = express.Router();
const { getWarehouses } = require('../controllers/warehouseController');

router.get('/', getWarehouses);

module.exports = router;
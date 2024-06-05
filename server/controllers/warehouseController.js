const Warehouse = require('../models/Warehouse');

exports.getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find({});
        res.json(warehouses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
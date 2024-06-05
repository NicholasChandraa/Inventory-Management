const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    name: {type: String, required: true},
    location: {type: String, required: true}
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
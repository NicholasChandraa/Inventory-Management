require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketConfig = require('./socket');

const ProductRouter = require('./routes/ProductRouter');
const UserRouter = require('./routes/userRouter');
const WarehouseRouter = require('./routes/warehouserouter');
const InventoryRouter = require('./routes/InventoryRouter');
const CustomerRouter = require('./routes/CustomerRouter');
const SaleRouter = require('./routes/SaleRouter');
const DistributionRouter = require('./routes/DistributionRouter');
const DashboardRouter = require('./routes/DashboardRouter');
const path = require('path');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: 'https://inventory-management-rose.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Inisialisasi Socket.io
const io = socketConfig.init(server);

// CONNECTION TO DATABASE MONGO DB
mongoose.connect(process.env.DB_URI)
.then(() => {
    console.log('Connected to Polytech Database...');
})
.catch((error) => {
    console.log(error);
})

// Untuk Upload Gambar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use Routes
app.use('/api/product', ProductRouter);
app.use('/api/users', UserRouter);
app.use('/api/warehouses', WarehouseRouter);
app.use('/api/inventory', InventoryRouter);
app.use('/api/customers', CustomerRouter);
app.use('/api/sales', SaleRouter);
app.use('/api/distribution', DistributionRouter);
app.use('/api/dashboard', DashboardRouter);

app.get('/api/status', async (req, res) => {
    try {
        const result = await mongoose.connection.db.admin().ping();
        res.status(200).json({ message: 'Database connection is healthy', result });
    } catch (error) {
        res.status(500).json({ message: 'Database connection failed', error });
    }
});

app.get('/api/users/test', (req, res) => {
    res.send('Users endpoint works!');
});

// Listen on Port
server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
})
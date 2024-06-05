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

// Middleware CORS
const corsOptions = {
    origin: 'https://inventory-management-api.vercel.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
  app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// Listen on Port
server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
})
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');

const app = express();
const PORT = 5000;
let products = []; // In-memory storage for products
let getCounter = 0;
let postCounter = 0;

// Middleware
app.use(bodyParser.json());

// Log server info and available endpoints
const logServerInfo = () => {
    const ip = Object.values(os.networkInterfaces())
        .flat()
        .find(item => item.family === 'IPv4' && !item.internal).address;
    console.log(`Server is listening at http://${ip}:${PORT}`);
    console.log('Endpoints:');
    console.log(`http://${ip}:${PORT}/products - method: GET, POST, DELETE`);
};

// Log each request and response
app.use((req, res, next) => {
    console.log(`> ${req.url} ${req.method}: received request`);
    res.on('finish', () => {
        console.log(`< ${req.url} ${req.method}: sending response`);
        console.log(`Processed Request Count --> Get: ${getCounter}, Post: ${postCounter}`);
    });
    next();
});

// GET all products
app.get('/products', (req, res) => {
    getCounter++;
    res.json(products);
});

// POST a new product
app.post('/products', (req, res) => {
    postCounter++;
    const product = req.body;
    if (product.productId && product.name && product.price && product.quantity) {
        products.push(product);
        res.status(201).json(product);
    } else {
        res.status(400).json({ error: 'Invalid product data' });
    }
});

// DELETE a product by ID
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.productId == id);
    if (index !== -1) {
        products.splice(index, 1);
        res.sendStatus(204); // No content
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    logServerInfo();
});

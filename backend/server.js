const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const productsFilePath = path.join(__dirname, 'products.json');

function readProducts() {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
}

function writeProducts(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

app.get('/products', (req, res) => {
    try {
        const products = readProducts();
        let filteredProducts = products;

        if (req.query.category) {
            filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
        }

        if (req.query.search) {
            const searchTerm = req.query.search.toLowerCase();
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
        }

        res.json(filteredProducts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/products/:id', (req, res) => {
    try {
        const products = readProducts();
        const id = parseInt(req.params.id);
        const product = products.find(p => p.id === id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/products', (req, res) => {
    try {
        const { name, category, price, image, stock } = req.body;

        if (!name || !category || price === undefined || !image || stock === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (price <= 0) {
            return res.status(400).json({ error: 'Price must be greater than 0' });
        }
        if (stock < 0) {
            return res.status(400).json({ error: 'Stock must be greater than or equal to 0' });
        }

        const products = readProducts();
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            name,
            category,
            price,
            image,
            stock
        };
        products.push(newProduct);
        writeProducts(products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/products/:id', (req, res) => {
    try {
        const products = readProducts();
        const id = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const { name, category, price, image, stock } = req.body;

        if (name !== undefined && !name) {
            return res.status(400).json({ error: 'Name cannot be empty' });
        }
        if (category !== undefined && !category) {
            return res.status(400).json({ error: 'Category cannot be empty' });
        }
        if (price !== undefined && price <= 0) {
            return res.status(400).json({ error: 'Price must be greater than 0' });
        }
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ error: 'Stock must be greater than or equal to 0' });
        }
        if (image !== undefined && !image) {
            return res.status(400).json({ error: 'Image cannot be empty' });
        }

        const updatedProduct = { ...products[productIndex] };
        if (name !== undefined) updatedProduct.name = name;
        if (category !== undefined) updatedProduct.category = category;
        if (price !== undefined) updatedProduct.price = price;
        if (image !== undefined) updatedProduct.image = image;
        if (stock !== undefined) updatedProduct.stock = stock;

        products[productIndex] = updatedProduct;
        writeProducts(products);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/products/:id', (req, res) => {
    try {
        const products = readProducts();
        const id = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        products.splice(productIndex, 1);
        writeProducts(products);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
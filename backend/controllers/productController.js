const service = require('../services/productService');

function getAll(req, res) {
    try {
        res.json(service.getAllProducts(req.query));
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
    }
}

function getOne(req, res) {
    try {
        const product = service.getProductById(parseInt(req.params.id));
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

function create(req, res) {
    try {
        res.status(201).json(service.createProduct(req.body));
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
    }
}

function update(req, res) {
    try {
        res.json(service.updateProduct(parseInt(req.params.id), req.body));
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
    }
}

function remove(req, res) {
    try {
        service.deleteProduct(parseInt(req.params.id));
        res.status(204).send();
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
    }
}

module.exports = { getAll, getOne, create, update, remove };

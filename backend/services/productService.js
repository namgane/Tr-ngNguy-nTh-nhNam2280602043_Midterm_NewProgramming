const { readProducts, writeProducts } = require('../models/productModel');

function getAllProducts({ category, search } = {}) {
    let products = readProducts();
    if (category) products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (search) {
        const term = search.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        );
    }
    return products;
}

function getProductById(id) {
    const products = readProducts();
    return products.find(p => p.id === id) || null;
}

function createProduct({ name, category, price, image, stock }) {
    if (!name || !category || price === undefined || !image || stock === undefined)
        throw { status: 400, message: 'All fields are required' };
    if (price <= 0) throw { status: 400, message: 'Price must be greater than 0' };
    if (stock < 0) throw { status: 400, message: 'Stock must be greater than or equal to 0' };

    const products = readProducts();
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name, category, price, image, stock
    };
    products.push(newProduct);
    writeProducts(products);
    return newProduct;
}

function updateProduct(id, body) {
    const products = readProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw { status: 404, message: 'Product not found' };

    const { name, category, price, image, stock } = body;
    if (name !== undefined && !name) throw { status: 400, message: 'Name cannot be empty' };
    if (category !== undefined && !category) throw { status: 400, message: 'Category cannot be empty' };
    if (price !== undefined && price <= 0) throw { status: 400, message: 'Price must be greater than 0' };
    if (stock !== undefined && stock < 0) throw { status: 400, message: 'Stock must be greater than or equal to 0' };
    if (image !== undefined && !image) throw { status: 400, message: 'Image cannot be empty' };

    const updated = { ...products[index], ...Object.fromEntries(
        Object.entries({ name, category, price, image, stock }).filter(([, v]) => v !== undefined)
    )};
    products[index] = updated;
    writeProducts(products);
    return updated;
}

function deleteProduct(id) {
    const products = readProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw { status: 404, message: 'Product not found' };
    products.splice(index, 1);
    writeProducts(products);
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };

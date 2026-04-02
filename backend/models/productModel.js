const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'products.json');

function readProducts() {
    return JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
}

function writeProducts(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

module.exports = { readProducts, writeProducts };

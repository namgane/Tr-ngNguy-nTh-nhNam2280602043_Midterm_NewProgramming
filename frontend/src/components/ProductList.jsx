import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, onViewProduct, onEditProduct, onDeleteProduct }) {
    if (products.length === 0) {
        return <div className="empty-message">Không tìm thấy sản phẩm nào</div>;
    }

    return (
        <div className="products-container">
            <div className="products-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onView={() => onViewProduct(product)}
                        onEdit={() => onEditProduct(product)}
                        onDelete={() => onDeleteProduct(product.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ProductList;
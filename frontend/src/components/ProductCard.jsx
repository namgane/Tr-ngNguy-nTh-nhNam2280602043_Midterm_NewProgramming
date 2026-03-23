import React from 'react';

function ProductCard({ product, onView, onEdit, onDelete }) {
    const stockStatus =
        product.stock === 0
            ? { label: 'Hết hàng', cls: 'stock-out' }
            : product.stock <= 5
            ? { label: 'Sắp hết', cls: 'stock-low' }
            : { label: 'Còn hàng', cls: 'stock-ok' };

    return (
        <div className="product-card" onClick={onView}>
            <div className="card-image-wrap">
                <img src={product.image} alt={product.name} />
                <span className={`stock-badge ${stockStatus.cls}`}>{stockStatus.label}</span>
            </div>
            <div className="card-body">
                <p className="category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="price">${Number(product.price).toLocaleString()}</p>
                <p className="stock">Tồn kho: {product.stock}</p>
            </div>
            <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn btn-info"    onClick={onView}>🔍 Chi tiết</button>
                <button className="btn btn-warning" onClick={onEdit}>✏️ Sửa</button>
                <button className="btn btn-danger"  onClick={onDelete}>🗑️</button>
            </div>
        </div>
    );
}

export default ProductCard;
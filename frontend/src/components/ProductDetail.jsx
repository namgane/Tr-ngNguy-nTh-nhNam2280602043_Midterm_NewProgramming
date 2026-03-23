import React from 'react';

function ProductDetail({ product, onClose, onEdit, onDelete }) {
    if (!product) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleDelete = () => {
        onClose();
        onDelete(product.id);
    };

    const handleEdit = () => {
        onClose();
        onEdit(product);
    };

    const stockStatus =
        product.stock === 0
            ? { label: 'Hết hàng', cls: 'stock-out' }
            : product.stock <= 5
            ? { label: 'Sắp hết', cls: 'stock-low' }
            : { label: 'Còn hàng', cls: 'stock-ok' };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-box detail-modal">
                {/* Header */}
                <div className="modal-header">
                    <h2>🔍 Chi tiết sản phẩm</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                <div className="detail-body">
                    <div className="detail-image-wrap">
                        <img src={product.image} alt={product.name} className="detail-image" />
                        <span className={`stock-badge ${stockStatus.cls}`}>{stockStatus.label}</span>
                    </div>

                    <div className="detail-info">
                        <h3 className="detail-name">{product.name}</h3>

                        <div className="detail-rows">
                            <div className="detail-row">
                                <span className="detail-label">Danh mục</span>
                                <span className="detail-value category-tag">{product.category}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Giá</span>
                                <span className="detail-value price-value">${Number(product.price).toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Tồn kho</span>
                                <span className={`detail-value ${stockStatus.cls}`}>{product.stock} sản phẩm</span>
                            </div>
                            {product.id && (
                                <div className="detail-row">
                                    <span className="detail-label">ID</span>
                                    <span className="detail-value id-value">#{product.id}</span>
                                </div>
                            )}
                        </div>

                        <div className="detail-actions">
                            <button className="btn btn-warning" onClick={handleEdit}>
                                ✏️ Chỉnh sửa
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                🗑️ Xóa sản phẩm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
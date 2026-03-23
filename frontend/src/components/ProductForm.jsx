import React, { useState, useEffect, useRef } from 'react';

function ProductForm({ onSubmit, onClose, initialData }) {
    const isEdit = !!initialData;

    const [formData, setFormData] = useState({
        name: '',
        category: 'Laptop',
        price: '',
        image: '',
        stock: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef();

    // Pre-fill form khi edit
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                category: initialData.category || 'Laptop',
                price: initialData.price || '',
                image: initialData.image || '',
                stock: initialData.stock ?? ''
            });
            setImagePreview(initialData.image || '');
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price'
                ? parseFloat(value) || ''
                : name === 'stock'
                    ? parseInt(value, 10) || ''
                    : value
        }));
    };

    // Chọn ảnh, resize + compress bằng Canvas trước khi lưu (tránh lỗi 413)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const MAX_SIZE = 800; // px
                let { width, height } = img;

                // Scale down nếu ảnh quá lớn
                if (width > MAX_SIZE || height > MAX_SIZE) {
                    if (width > height) {
                        height = Math.round((height * MAX_SIZE) / width);
                        width = MAX_SIZE;
                    } else {
                        width = Math.round((width * MAX_SIZE) / height);
                        height = MAX_SIZE;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);

                // Compress sang JPEG, quality 0.75 (~50-150KB thay vì vài MB)
                const compressed = canvas.toDataURL('image/jpeg', 0.75);
                setImagePreview(compressed);
                setFormData(prev => ({ ...prev, image: compressed }));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc';
        if (!formData.category) newErrors.category = 'Danh mục là bắt buộc';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
        if (formData.stock === '' || formData.stock < 0) newErrors.stock = 'Tồn kho phải >= 0';
        if (!formData.image) newErrors.image = 'Vui lòng chọn ảnh sản phẩm';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        onSubmit(formData);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-box">
                <div className="modal-header">
                    <h2>{isEdit ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <form className="product-form" onSubmit={handleSubmit}>
                    {/* Image picker */}
                    <div className="form-group full-width">
                        <label>Ảnh sản phẩm *</label>
                        <div
                            className={`image-picker ${errors.image ? 'error' : ''}`}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            ) : (
                                <div className="image-placeholder">
                                    <span className="upload-icon">📁</span>
                                    <span>Nhấn để chọn ảnh từ máy tính</span>
                                    <span className="upload-hint">JPG, PNG, WEBP...</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        {imagePreview && (
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => fileInputRef.current.click()}
                                style={{ marginTop: 6 }}
                            >
                                🔄 Đổi ảnh
                            </button>
                        )}
                        {errors.image && <span className="error-message">{errors.image}</span>}
                    </div>

                    {/* Name */}
                    <div className="form-group">
                        <label>Tên sản phẩm *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên sản phẩm"
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label>Danh mục *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={errors.category ? 'error' : ''}
                        >
                            <option value="Laptop">Laptop</option>
                            <option value="Phone">Phone</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>

                    {/* Price */}
                    <div className="form-group">
                        <label>Giá ($) *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Nhập giá"
                            min="0"
                            step="0.01"
                            className={errors.price ? 'error' : ''}
                        />
                        {errors.price && <span className="error-message">{errors.price}</span>}
                    </div>

                    {/* Stock */}
                    <div className="form-group">
                        <label>Tồn kho *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="Nhập số lượng"
                            min="0"
                            className={errors.stock ? 'error' : ''}
                        />
                        {errors.stock && <span className="error-message">{errors.stock}</span>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEdit ? '💾 Lưu thay đổi' : '➕ Thêm sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;
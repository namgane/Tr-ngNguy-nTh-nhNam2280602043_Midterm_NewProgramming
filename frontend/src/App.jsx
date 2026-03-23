import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductDetail from './components/ProductDetail';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formModal, setFormModal] = useState(null);
    const [detailModal, setDetailModal] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const API_URL = 'http://localhost:5000/products';

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filterCategory) params.append('category', filterCategory);
            const url = params.toString() ? `${API_URL}?${params}` : API_URL;
            const response = await axios.get(url);
            setProducts(response.data);
        } catch (err) {
            setError('Không thể tải sản phẩm: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filterCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddProduct = async (productData) => {
        try {
            const response = await axios.post(API_URL, productData);
            setProducts(prev => [...prev, response.data]);
            setFormModal(null);
            alert('Thêm sản phẩm thành công!');
        } catch (err) {
            alert('Lỗi khi thêm: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleUpdateProduct = async (id, productData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, productData);
            setProducts(prev => prev.map(p => p.id === id ? response.data : p));
            setFormModal(null);
            alert('Cập nhật thành công!');
        } catch (err) {
            alert('Lỗi khi cập nhật: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
            alert('Đã xóa sản phẩm!');
        } catch (err) {
            alert('Lỗi khi xóa: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleFormSubmit = (formData) => {
        if (formModal && formModal !== 'add') {
            handleUpdateProduct(formModal.id, formData);
        } else {
            handleAddProduct(formData);
        }
    };

    const editingProduct = formModal && formModal !== 'add' ? formModal : null;

    return (
        <div className="app">
            <header className="header">
                <h1>Midterm Project</h1>
                <button className="btn btn-primary" onClick={() => setFormModal('add')}>
                    ➕ Thêm sản phẩm
                </button>
            </header>

            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Tất cả danh mục</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Phone">Phone</option>
                </select>
            </div>

            {loading && <p className="loading">Đang tải sản phẩm...</p>}
            {error && <p className="error">{error}</p>}

            <ProductList
                products={products}
                onViewProduct={(product) => setDetailModal(product)}
                onEditProduct={(product) => setFormModal(product)}
                onDeleteProduct={handleDeleteProduct}
            />

            {}
            {detailModal && (
                <ProductDetail
                    product={detailModal}
                    onClose={() => setDetailModal(null)}
                    onEdit={(product) => {
                        setDetailModal(null);
                        setFormModal(product);
                    }}
                    onDelete={(id) => {
                        setDetailModal(null);
                        handleDeleteProduct(id);
                    }}
                />
            )}

            {}
            {formModal !== null && (
                <ProductForm
                    onSubmit={handleFormSubmit}
                    onClose={() => setFormModal(null)}
                    initialData={editingProduct}
                />
            )}
        </div>
    );
}

export default App;
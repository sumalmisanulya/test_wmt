import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [loading, setLoading] = useState(true);

  // Use the environment variable if available (for production), otherwise fallback to localhost
  const API_URL = process.env.REACT_APP_API_URL || "https://test-wmt-3hnp.onrender.com";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    try {
      const res = await axios.post(API_URL, formData);
      setProducts([res.data, ...products]);
      setFormData({ name: '', price: '', description: '' });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="container">
      <h1>Product Galaxy</h1>

      <div className="card">
        <form onSubmit={addProduct}>
          <div className="input-group">
            <input
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Price ($)"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description (Optional)"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Launch to Database</button>
        </form>
      </div>

      <div className="product-list">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Warping through database...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>No products found in this quadrant.</p>
        ) : (
          products.map(product => (
            <div key={product._id} className="product-item">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description || "No description provided."}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="price-tag">${product.price}</span>
                <button className="delete-btn" onClick={() => deleteProduct(product._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
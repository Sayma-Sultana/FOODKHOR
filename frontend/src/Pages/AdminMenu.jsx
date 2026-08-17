import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';

const AdminMenu = () => {
    const { user, loading: authLoading } = useAuth();
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [showAddDish, setShowAddDish] = useState(false);

    // Form States
    const [newCategory, setNewCategory] = useState('');
    const [dishForm, setDishForm] = useState({
        title: '',
        category: '',
        price: '',
        description: ''
    });
    const [dishImage, setDishImage] = useState(null);
    const [editingDish, setEditingDish] = useState(null);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [dishesRes, categoriesRes] = await Promise.all([
                axios.get(`\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/dish/getall`, { withCredentials: true }),
                axios.get(`\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/category/getall`, { withCredentials: true })
            ]);
            setDishes(dishesRes.data.dishes);
            setCategories(categoriesRes.data.categories);
        } catch (error) {
            toast.error('Failed to fetch menu data');
        } finally {
            setLoading(false);
        }
    };

    // Category Handlers
    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/category/add`,
                { title: newCategory },
                { withCredentials: true }
            );
            toast.success(data.message);
            setCategories([...categories, data.category]);
            setNewCategory('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category');
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/category/delete/${id}`, { withCredentials: true });
            setCategories(categories.filter(c => c._id !== id));
            toast.success('Category deleted');
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    // Dish Handlers
    const handleDishSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', dishForm.title);
            formData.append('category', dishForm.category);
            formData.append('price', dishForm.price);
            formData.append('description', dishForm.description);
            if (dishImage) {
                formData.append('image', dishImage);
            }

            if (editingDish) {
                const { data } = await axios.put(
                    `\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/dish/update/${editingDish._id}`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
                setDishes(dishes.map(d => d._id === editingDish._id ? data.dish : d));
                toast.success('Dish updated successfully');
            } else {
                const { data } = await axios.post(
                    `\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/dish/add`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
                setDishes([...dishes, data.dish]);
                toast.success('Dish added successfully');
            }
            setShowAddDish(false);
            setEditingDish(null);
            setDishForm({ title: '', category: '', price: '', description: '' });
            setDishImage(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save dish');
        }
    };

    const handleDeleteDish = async (id) => {
        if (!window.confirm('Are you sure you want to delete this dish?')) return;
        try {
            await axios.delete(`\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/dish/delete/${id}`, { withCredentials: true });
            setDishes(dishes.filter(d => d._id !== id));
            toast.success('Dish deleted');
        } catch (error) {
            toast.error('Failed to delete dish');
        }
    };

    const startEditDish = (dish) => {
        setEditingDish(dish);
        setDishForm({
            title: dish.title,
            category: dish.category,
            price: dish.price,
            description: dish.description
        });
        setDishImage(null);
        setShowAddDish(true);
    };

    if (authLoading) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <Navigate to="/admin" replace />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <section className="adminMenu" style={{ padding: '50px 0', flex: 1 }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h1 className="heading" style={{ margin: 0 }}>MANAGE MENU</h1>
                        <Link to="/admin/dashboard" className="back_btn" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <HiOutlineArrowNarrowLeft /> Back to Dashboard
                        </Link>
                    </div>

                    <div className="menu_actions" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <button
                            className="auth_btn"
                            onClick={() => { setShowAddDish(true); setEditingDish(null); setDishForm({ title: '', category: '', price: '', description: '' }); setDishImage(null); }}
                            style={{ backgroundColor: '#222', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
                        >
                            Add New Dish
                        </button>
                        <button
                            className="auth_btn"
                            onClick={() => setShowCategoryManager(!showCategoryManager)}
                            style={{ backgroundColor: showCategoryManager ? '#f57c00' : '#222', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
                        >
                            Manage Categories
                        </button>
                    </div>

                    {/* Category Manager Section */}
                    {showCategoryManager && (
                        <div className="category_manager" style={{ padding: '20px', background: '#f9f9f9', marginBottom: '30px', borderRadius: '8px' }}>
                            <h3>Manage Categories</h3>
                            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="New Category Name"
                                    required
                                    style={{ padding: '8px', flex: 1 }}
                                />
                                <button type="submit" style={{ padding: '8px 20px', background: '#222', color: '#fff', border: 'none' }}>Add</button>
                            </form>
                            <div className="category_list" style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {categories.map(cat => (
                                    <span key={cat._id} style={{ padding: '5px 15px', background: '#fff', border: '1px solid #ddd', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {cat.title}
                                        <button onClick={() => handleDeleteCategory(cat._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dish Form Modal/Section */}
                    {showAddDish && (
                        <div className="dish_form_section" style={{ padding: '20px', background: '#fff', border: '1px solid #ddd', marginBottom: '30px' }}>
                            <h3>{editingDish ? 'Edit Dish' : 'Add New Dish'}</h3>
                            <form onSubmit={handleDishSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                                <input type="text" placeholder="Dish Name" value={dishForm.title} onChange={e => setDishForm({ ...dishForm, title: e.target.value })} required style={{ padding: '10px' }} />
                                <select value={dishForm.category} onChange={e => setDishForm({ ...dishForm, category: e.target.value })} required style={{ padding: '10px' }}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat._id} value={cat.title}>{cat.title}</option>)}
                                </select>
                                <input type="number" placeholder="Price" value={dishForm.price} onChange={e => setDishForm({ ...dishForm, price: e.target.value })} required style={{ padding: '10px' }} />
                                <input type="number" placeholder="Price" value={dishForm.price} onChange={e => setDishForm({ ...dishForm, price: e.target.value })} required style={{ padding: '10px' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label>Dish Image:</label>
                                    <input type="file" accept="image/*" onChange={e => setDishImage(e.target.files[0])} style={{ padding: '10px' }} required={!editingDish} />
                                </div>
                                <textarea placeholder="Description" value={dishForm.description} onChange={e => setDishForm({ ...dishForm, description: e.target.value })} required style={{ padding: '10px', minHeight: '100px' }} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" style={{ padding: '10px 20px', background: '#f57c00', color: '#fff', border: 'none', cursor: 'pointer' }}>{editingDish ? 'Update Dish' : 'Add Dish'}</button>
                                    <button type="button" onClick={() => setShowAddDish(false)} style={{ padding: '10px 20px', background: '#ccc', color: '#000', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Dish List */}
                    <div className="menu_list_container">
                        {loading ? <p>Loading menu...</p> : (
                            <div className="dish_grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {dishes.map(dish => (
                                    <div key={dish._id} className="dish_card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                                        <img src={dish.image} alt={dish.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
                                        <div style={{ marginTop: '10px' }}>
                                            <h4 style={{ margin: '5px 0' }}>{dish.title}</h4>
                                            <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{dish.category}</span>
                                            <p style={{ fontWeight: 'bold', marginTop: '5px' }}>৳{dish.price}</p>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                <button onClick={() => startEditDish(dish)} style={{ flex: 1, padding: '5px', background: '#222', color: '#fff', border: 'none', cursor: 'pointer' }}>Edit</button>
                                                <button onClick={() => handleDeleteDish(dish._id)} style={{ flex: 1, padding: '5px', background: 'red', color: '#fff', border: 'none', cursor: 'pointer' }}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default AdminMenu;

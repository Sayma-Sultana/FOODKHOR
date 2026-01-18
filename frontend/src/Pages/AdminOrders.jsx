import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchPendingOrders();
        }
    }, [user]);

    const fetchPendingOrders = async () => {
        try {
            const { data } = await axios.get(
                'http://localhost:4000/api/v1/order/admin/pending',
                { withCredentials: true }
            );
            setOrders(data.orders);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const { data } = await axios.put(
                `http://localhost:4000/api/v1/order/admin/update-status/${orderId}`,
                { status },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            toast.success(data.message);
            fetchPendingOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        }
    };

    if (authLoading) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <section className="adminOrders">
                <div className="container">
                    <h1 className="heading">PENDING ORDERS</h1>
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <div className="no_orders">
                            <p>No pending orders</p>
                        </div>
                    ) : (
                        <div className="orders_list">
                            {orders.map((order) => (
                                <div key={order._id} className="order_card">
                                    <div className="order_header">
                                        <div>
                                            <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                                            <p className="order_date">
                                                {new Date(order.orderDate).toLocaleString()}
                                            </p>
                                            <p className="customer_info">
                                                Customer: {order.user.firstName} {order.user.lastName}
                                            </p>
                                            <p className="customer_info">Email: {order.user.email}</p>
                                            <p className="customer_info">Phone: {order.user.phone}</p>
                                        </div>
                                        <div className="order_total">
                                            <p>Total: ৳{order.totalAmount}</p>
                                        </div>
                                    </div>
                                    <div className="order_items">
                                        <h4>Items:</h4>
                                        {order.items.map((item, index) => (
                                            <div key={index} className="order_item">
                                                <img src={item.image} alt={item.title} />
                                                <div className="order_item_info">
                                                    <p>{item.title}</p>
                                                    <p>Quantity: {item.quantity} × ৳{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="shipping_info">
                                        <h4>Shipping Address:</h4>
                                        <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                                        <p>Phone: {order.shippingAddress.phone}</p>
                                    </div>
                                    <div className="order_actions">
                                        <button
                                            className="status_btn delivered"
                                            onClick={() => updateOrderStatus(order._id, 'delivered')}
                                        >
                                            Delivered
                                        </button>
                                        <button
                                            className="status_btn returned"
                                            onClick={() => updateOrderStatus(order._id, 'returned')}
                                        >
                                            Returned
                                        </button>
                                        <button
                                            className="status_btn out_of_ingredients"
                                            onClick={() => updateOrderStatus(order._id, 'out_of_ingredients')}
                                        >
                                            Out of Ingredients
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default AdminOrders;

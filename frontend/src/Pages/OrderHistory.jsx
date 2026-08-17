import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrderHistory = () => {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const endpoint = user.role === 'admin'
                ? `\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/order/admin/all`
                : `\$\{import.meta.env.VITE_API_URL || 'http://localhost:4000'\}/api/v1/order/my-orders`;
            
            const { data } = await axios.get(endpoint, { withCredentials: true });
            setOrders(data.orders);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'delivered':
                return 'status_delivered';
            case 'returned':
                return 'status_returned';
            case 'out_of_ingredients':
                return 'status_out_of_ingredients';
            default:
                return 'status_pending';
        }
    };

    if (authLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <section className="orderHistory">
                <div className="container">
                    <h1 className="heading">
                        {user.role === 'admin' ? 'ALL ORDERS' : 'MY ORDER HISTORY'}
                    </h1>
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <div className="no_orders">
                            <p>No orders found</p>
                        </div>
                    ) : (
                        <div className="orders_list">
                            {orders.map((order) => (
                                <div key={order._id} className="order_card">
                                    <div className="order_header">
                                        <div>
                                            <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                                            <p className="order_date">
                                                Ordered: {new Date(order.orderDate).toLocaleString()}
                                            </p>
                                            {order.deliveredDate && (
                                                <p className="order_date">
                                                    Delivered: {new Date(order.deliveredDate).toLocaleString()}
                                                </p>
                                            )}
                                            {user.role === 'admin' && order.user && (
                                                <>
                                                    <p className="customer_info">
                                                        Customer: {order.user.firstName} {order.user.lastName}
                                                    </p>
                                                    <p className="customer_info">Email: {order.user.email}</p>
                                                </>
                                            )}
                                        </div>
                                        <div className="order_total">
                                            <p>Total: ৳{order.totalAmount}</p>
                                            <span className={`status_badge ${getStatusClass(order.status)}`}>
                                                {order.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="order_items">
                                        <h4>Items:</h4>
                                        {order.items.map((item, index) => (
                                            <div key={index} className="order_item">
                                                <img src={item.image} alt={item.title} />
                                                <div className="order_item_info">
                                                    <p>{item.title}</p>
                                                    <p>Quantity: {item.quantity} × ৳{item.price} = ৳{item.quantity * item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {order.shippingAddress && (
                                        <div className="shipping_info">
                                            <h4>Shipping Address:</h4>
                                            <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                                            <p>Phone: {order.shippingAddress.phone}</p>
                                        </div>
                                    )}
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

export default OrderHistory;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
    }, []);

    const updateQuantity = (id, change) => {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + change;
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Item removed from cart');
    };

    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            toast.error('Your cart is empty!');
            return;
        }

        if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
            toast.error('Please fill in all shipping details');
            return;
        }

        setLoading(true);
        try {
            // Transform cart items to match order schema (id -> dishId)
            const orderItems = cart.map(item => ({
                dishId: String(item.id),
                title: item.title,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            }));

            const { data } = await axios.post(
                'http://localhost:4000/api/v1/order/create',
                { items: orderItems, shippingAddress },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            toast.success(data.message);
            localStorage.removeItem('cart');
            setCart([]);
            navigate('/order-history');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <section className="cart">
                    <div className="container">
                        <h1 className="heading">YOUR CART</h1>
                        <div className="empty_cart">
                            <p>Your cart is empty!</p>
                            <Link to="/menu" className="back_to_menu_btn">
                                Browse Menu <HiOutlineArrowNarrowRight />
                            </Link>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <section className="cart">
                <div className="container">
                    <h1 className="heading">YOUR CART</h1>
                    <div className="cart_content">
                        <div className="cart_items">
                            {cart.map((item) => (
                                <div key={item.id} className="cart_item">
                                    <img src={item.image} alt={item.title} />
                                    <div className="cart_item_info">
                                        <h3>{item.title}</h3>
                                        <p className="cart_item_price">৳{item.price} each</p>
                                        <div className="cart_item_actions">
                                            <div className="quantity_controls">
                                                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                            </div>
                                            <button className="remove_btn" onClick={() => removeItem(item.id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart_item_total">
                                        <p>৳{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order_summary">
                            <h2>Order Summary</h2>
                            <form onSubmit={handlePlaceOrder}>
                                <div className="shipping_form">
                                    <h3>Shipping Details</h3>
                                    <input
                                        type="text"
                                        placeholder="Street Address"
                                        value={shippingAddress.street}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={shippingAddress.phone}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="total_section">
                                    <div className="total_row">
                                        <span>Subtotal:</span>
                                        <span>৳{totalAmount}</span>
                                    </div>
                                    <div className="total_row">
                                        <span>Total:</span>
                                        <span className="total_amount">৳{totalAmount}</span>
                                    </div>
                                </div>
                                <button type="submit" className="place_order_btn" disabled={loading}>
                                    {loading ? 'Placing Order...' : 'PLACE ORDER'}{' '}
                                    <span>
                                        <HiOutlineArrowNarrowRight />
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Cart;

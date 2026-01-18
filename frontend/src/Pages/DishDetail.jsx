import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { data } from '../restApi.json';
import toast from 'react-hot-toast';

const DishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const menuItems = data[0].menuItems || [];
  const dishes = data[0].dishes || [];
  const dish = menuItems.find((item) => String(item.id) === String(id)) || 
               dishes.find((item) => String(item.id) === String(id));

  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === dish.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: dish.id,
        title: dish.title,
        image: dish.image,
        price: dish.price,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${quantity} ${dish.title} added to cart!`);
  };

  const handleOrder = () => {
    addToCart();
    navigate('/cart');
  };

  if (!dish) {
    return (
      <>
        <section className="notFound">
          <div className="container">
            <img src="/notFound.svg" alt="notFound" />
            <h1>DISH NOT FOUND</h1>
            <p>We can&apos;t find the dish you are looking for.</p>
            <Link to="/">Back to Home</Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <section className="dishDetail">
        <div className="container">
          <div className="dishDetail_content">
            <div className="dishDetail_image">
              <img src={dish.image} alt={dish.title} />
            </div>
            <div className="dishDetail_info">
              <h1>{dish.title}</h1>
              <p className="dishDetail_category">{dish.category}</p>
              <p className="dishDetail_price">৳{dish.price}</p>
              {dish.description && (
                <p className="dishDetail_description">{dish.description}</p>
              )}
              
              <div className="dishDetail_quantity">
                <label>Quantity:</label>
                <div className="quantity_controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <div className="dishDetail_actions">
                <button className="add_to_cart_btn" onClick={addToCart}>
                  Add to Cart
                </button>
                <button className="order_btn" onClick={handleOrder}>
                  Order Now
                </button>
              </div>

              <Link to="/menu" className="dishDetail_back">
                Back to Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DishDetail;


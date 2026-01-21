import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { data } from "../restApi.json";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { getCartKey } from '../utils/cartUtils';

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const updateCartCount = () => {
      const cartKey = getCartKey(user);
      const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 1000);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success('Logged out successfully!');
      navigate('/');
      setShow(false);
    }
  };

  return (
    <nav>
      <Link to="/" className="logo">FOODKHOR</Link>
      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          {isHomePage ? (
            data[0].navbarLinks.map((element) => {
              return (
                <ScrollLink
                  to={element.link}
                  key={element.id}
                  spy={true}
                  smooth={true}
                  duration={500}
                  onClick={() => setShow(false)}
                >
                  {element.title}
                </ScrollLink>
              );
            })
          ) : (
            <Link to="/" onClick={() => setShow(false)}>HOME</Link>
          )}
        </div>
        <div className="nav_actions">
          <Link to="/menu" className='menuBtn' onClick={() => setShow(false)}>OUR MENU</Link>
          <Link to="/cart" className="cart_icon" onClick={() => setShow(false)}>
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart_badge">{cartCount}</span>}
          </Link>
          {!loading && (
            <>
              {user ? (
                <div className="user_info">
                  <Link to="/order-history" className="order_history_link" onClick={() => setShow(false)}>
                    Orders
                  </Link>
                  <span className="user_name">{user.firstName}</span>
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin/orders" className="admin_link" onClick={() => setShow(false)}>Manage Orders</Link>
                      <Link to="/admin/dashboard" className="admin_link" onClick={() => setShow(false)}>Dashboard</Link>
                    </>
                  )}
                  <button className="logoutBtn" onClick={handleLogout}>Logout</button>
                </div>
              ) : (
                <div className="auth_buttons">
                  <Link to="/login" className="loginBtn" onClick={() => setShow(false)}>Login</Link>
                  <Link to="/signup" className="signupBtn" onClick={() => setShow(false)}>Sign Up</Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className='hamburger' onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
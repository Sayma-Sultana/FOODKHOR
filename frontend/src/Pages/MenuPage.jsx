import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { data } from '../restApi.json';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = data[0].menuCategories || [];
  const menuItems = data[0].menuItems || [];

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <section className="menuPage">
        <div className="container">
          <div className="heading_section">
            <h1 className="heading">OUR MENU</h1>
            <p>Explore our delicious selection of dishes from different categories</p>
          </div>

          <div className="category_filter">
            <button 
              className={selectedCategory === 'All' ? 'active' : ''}
              onClick={() => setSelectedCategory('All')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={selectedCategory === category.name ? 'active' : ''}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="menu_items_container">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Link to={`/dish/${item.id}`} className="menu_item_card" key={item.id}>
                  <div className="menu_item_image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="menu_item_info">
                    <h3>{item.title}</h3>
                    <p className="menu_item_category">{item.category}</p>
                    <p className="menu_item_price">৳{item.price}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no_items">No items found in this category.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MenuPage;

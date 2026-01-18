import React from 'react';
import { Link } from 'react-router-dom';
import { data } from '../restApi.json';

const Menu = () => {
  const popularDishes = data[0].dishes.filter(dish => dish.popular) || data[0].dishes;
  
  return (
    <section className='menu' id="menu">
      <div className="container">
        <div className="heading_section">
           <h1 className='heading'>POPULAR DISHES</h1>
           <p>
            Our popular dishes are loved for their flavor, freshness,
            and consistent quality.
           </p>
          </div>
          <div className="dishes_container">
            {popularDishes.map((element) => {
              return (
                <Link to={`/dish/${element.id}`} className="card" key={element.id}>
                  <img src={element.image} alt={element.title} />
                  <h3>{element.title}</h3>
                  <button>{element.category}</button>
                  <p className="dish_price">৳{element.price}</p>
                </Link>
               );
             })}
           </div>
         </div>
       </section>
  );
};

export default Menu;
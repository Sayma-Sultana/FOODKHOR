import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const About = () => {
  return (
    <section className='about' id= "about">
      <div className="container">
        <div className="banner">
            <div className="top">
                <h1 className='heading'>ABOUT US</h1>
                <p>Nothing matters to us except food.</p>
                </div>
                <p className="mid">
                    Foodkhor is a modern restaurant platform dedicated to 
                    serving delicious,freshly prepared meals with care and 
                    consistency. We combine quality ingredients, skilled chefs, 
                    and fast service to deliver a satisfying food experience 
                    that customers can enjoy anytime, anywhere.
                </p>
                <Link to={"/"}>
                  Explore Menu{" "}
                  <span>
                    <HiOutlineArrowNarrowRight/>
                  </span>
                </Link>
              </div>
              <div className="banner">
                <img src="/about.png" alt="about" />
              </div>
            </div>
          </section>
       );
};

export default About
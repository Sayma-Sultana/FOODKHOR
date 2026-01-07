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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Numquam assumenda similique quas optio doloremque, 
                    provident eaque ullam excepturi qui quibusdam. 
                    Facilis ratione vitae odit suscipit. In eius qui nulla ea voluptas eligendi, 
                    tenetur sit molestiae quod ex quo? Aliquid dolorem nam deleniti asperiores, 
                    ex quas accusantium beatae distinctio hic. tum!
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
import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { GiHamburgerMenu } from "react-icons/gi";
import { data } from "../restApi.json";

const Navbar = () => {
    const [show, setShow] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

  return (
    <nav>
        <Link to="/" className="logo">FOODKHOR</Link>
        <div className={show ? "navLinks showmenu": "navLinks"}>
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
          <Link to="/menu" className='menuBtn' onClick={() => setShow(false)}>OUR MENU</Link>
        </div>
        <div className='hamburger' onClick ={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
    </nav>
  );
};

export default Navbar;
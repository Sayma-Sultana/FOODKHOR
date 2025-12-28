import React, { useState } from 'react';
import { Link } from "react-scroll";
import { GitHamburgerMenu } from "react-icons/gi";
import { data } from "../restApi.json";

const Navbar = () => {
    const {show, setShow} = useState(false);
  return (
    <nav>
        <div className="logo">FoodKhor</div>
        <div className={show ? "navLinks showmenu": "navLinks"}></div>
    </nav>
  );
};

export default Navbar;
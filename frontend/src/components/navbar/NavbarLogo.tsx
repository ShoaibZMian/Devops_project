import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Logo from "../../assets/logo.svg";

const NavbarLogo = () => {
  return (
    <Link to="/home">
      <img
        src={Logo}
        alt="logo"
        style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#F7F7F7",
        }}
      />
    </Link>
  );
};

export default NavbarLogo;

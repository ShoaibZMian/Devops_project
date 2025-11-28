import NavbarLogo from "./NavbarLogo";
import "../../styles/navbar/Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated: authenticated, isAdmin: admin, logout } = useAuth();

  const navigateToCheckout = () => {
    navigate("/checkout");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavbarLogo />
      </div>
      <div className="nav-center">
        <a href="/" className="nav-item">
          Home
        </a>
        <a href="/products" className="nav-item">
          Products
        </a>
        <a href="/about" className="nav-item">
          About
        </a>
        {!authenticated && (
          <a href="/login" className="nav-item">
            Login
          </a>
        )}
        {authenticated && admin && (
          <a href="/dashboard" className="nav-item">
            Dashboard
          </a>
        )}
        {authenticated && (
          <button onClick={handleLogout} className="nav-item" style={{background: 'none', border: 'none', cursor: 'pointer'}}>
            Logout
          </button>
        )}
      </div>
      <div className="nav-right">
        <button className="cart-button" onClick={navigateToCheckout}>
          Cart
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

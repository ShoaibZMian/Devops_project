import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";

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
    <nav className="border-b bg-background sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap gap-4 py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/">
            <img
              src="/9a1fc0711d294b37a251d8baf786ac68-free.png"
              alt="Shoaib Store"
              className="h-24 w-auto"
            />
          </Link>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2 items-center justify-center">
          <a
            href="/"
            className="text-foreground hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-foreground hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
          >
            About
          </a>
          {!authenticated && (
            <a
              href="/login"
              className="text-foreground hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
            >
              Login
            </a>
          )}
          {authenticated && admin && (
            <a
              href="/dashboard"
              className="text-foreground hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </a>
          )}
          {authenticated && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
            >
              Logout
            </Button>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <Button
            onClick={navigateToCheckout}
            variant="default"
            size="default"
          >
            Cart
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

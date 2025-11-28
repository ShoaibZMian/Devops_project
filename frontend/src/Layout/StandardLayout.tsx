import { lazy, ReactNode } from "react";
import "../styles/shared/Layout.css";
import LoadingSpinner from "../components/loadingspinner/LoadingSpinner";

interface StandardLayoutProps {
  children: ReactNode;
}

const Navbar = lazy(() => import("../components/navbar/Navbar"));

const StandardLayout = ({ children }: StandardLayoutProps) => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="layout-main">
        <div className="layout-container">{children}</div>
      </main>
    </div>
  );
};

export default StandardLayout;

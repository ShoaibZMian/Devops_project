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
      <div className="layout-wrapper">
        <main className="layout-main">
          <div className="h-full">
            <div className="layout-container container">{children}</div>
            <div className="layout-footer"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StandardLayout;

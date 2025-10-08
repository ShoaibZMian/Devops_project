import { useState } from "react";
import StandardLayout from "./StandardLayout.tsx";
import "../styles/shared/App.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <div className="main-container">
      <StandardLayout children={props.children} />
    </div>
  );
};

export default Layout;

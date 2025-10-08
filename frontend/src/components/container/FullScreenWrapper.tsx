import React from "react";
import "../../styles/containers/FullScreenWrapperStyles.css";

interface FullScreenWrapperProps {
  children: React.ReactNode;
  extraClassName?: string;
}

const FullScreenWrapper = (props: FullScreenWrapperProps) => {
  return (
    <div className={`full-screen-wrapper ${props.extraClassName}`}>
      {props.children}
    </div>
  );
};

export default FullScreenWrapper;

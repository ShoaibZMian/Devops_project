import "../../styles/containers/FullSizeSpaceContainer.css";

interface FullSizeSpaceContainerProps {
  children: React.ReactNode;
  extraClassName?: string;
}

const FullSizeSpaceContainer = (props: FullSizeSpaceContainerProps) => {
  return (
    <div className={`full-size-space-container ${props.extraClassName}`}>
      {props.children}
    </div>
  );
};

export default FullSizeSpaceContainer;

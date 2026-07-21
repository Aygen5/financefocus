import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${
        fluid ? "max-w-full" : "max-w-7xl"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;

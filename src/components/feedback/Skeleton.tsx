import React from "react";

export interface SkeletonProps {
  variant?: "text" | "rect" | "circle";
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ variant = "rect", width, height, className = "" }) => {
  const baseStyles = "animate-pulse bg-slate-200 dark:bg-slate-800";

  const variants = {
    text: "h-3.5 w-full rounded-md",
    rect: "rounded-xl",
    circle: "rounded-full",
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
      role="status"
      aria-live="polite"
      aria-label="Yükleniyor..."
    />
  );
};

export default Skeleton;

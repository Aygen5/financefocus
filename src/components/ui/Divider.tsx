import React from "react";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ orientation = "horizontal", className = "" }) => {
  const styles =
    orientation === "horizontal"
      ? `w-full h-[1px] bg-slate-200/60 dark:bg-slate-800/60 my-4 ${className}`
      : `h-full w-[1px] bg-slate-200/60 dark:bg-slate-800/60 mx-4 ${className}`;

  return <div className={styles} role="none" />;
};

export default Divider;

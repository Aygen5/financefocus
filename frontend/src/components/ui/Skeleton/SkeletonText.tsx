import React from "react";
import Skeleton from "./Skeleton";
import { cn } from "@/utils/styles";

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  heightClass?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  className = "",
  rows = 3,
  heightClass = "h-3",
  ...props
}) => {
  return (
    <div className={cn("space-y-2.5 w-full select-none", className)} {...props}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn(heightClass, index === rows - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
};

export default SkeletonText;

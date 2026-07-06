import React, { useState } from "react";
import { cn } from "@/utils/styles";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({
  className = "",
  src,
  alt = "Kullanıcı Avatarı",
  fallback,
  size = "md",
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const baseStyles =
    "relative flex shrink-0 overflow-hidden rounded-full border border-slate-200/80 dark:border-slate-800 select-none bg-slate-100 dark:bg-slate-800 items-center justify-center font-bold text-slate-600 dark:text-slate-350";

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className={cn(baseStyles, sizes[size], className)} {...props}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(fallback || alt)}</span>
      )}
    </div>
  );
};

export default Avatar;

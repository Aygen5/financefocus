import React, { useState } from "react";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = "md", className = "" }) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: "h-8 w-8 text-xs font-semibold",
    md: "h-10 w-10 text-sm font-bold",
    lg: "h-14 w-14 text-lg font-bold",
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const showImage = src && !hasError;

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden select-none bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-slate-200/50 dark:border-slate-800/50 shadow-soft-sm ${sizes[size]} ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;

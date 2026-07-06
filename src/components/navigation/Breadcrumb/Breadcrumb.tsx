import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/utils/styles";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = "",
  showHome = true,
}) => {
  return (
    <nav className={cn("flex select-none text-left", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center gap-1.5 md:gap-2">
        {showHome && (
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
            >
              <Home size={14} />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5 md:gap-2">
              <span className="text-slate-400 select-none">
                <ChevronRight size={14} />
              </span>

              {isLast || !item.path ? (
                <span
                  className="text-xs font-bold text-slate-800 dark:text-slate-100"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-xs font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

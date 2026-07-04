import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center text-xs select-none ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
        {/* Home icon link */}
        <li className="flex items-center">
          <Link
            to="/dashboard"
            className="flex items-center hover:text-brand-500 transition-colors"
            aria-label="Ana sayfa"
          >
            <Home size={14} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li className="text-slate-400">
                <ChevronRight size={12} />
              </li>
              <li className="flex items-center">
                {!isLast && item.path ? (
                  <Link to={item.path} className="hover:text-brand-500 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-slate-800 dark:text-slate-200 font-bold"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

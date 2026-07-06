import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/styles";
import Button from "@/components/ui/Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  // Sayfa numarası üretme mantığı
  const getPages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Karmaşık sayfalama (örn. 1, 2, ..., 10, 11)
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <nav
      className={cn("flex items-center gap-1 select-none text-left", className)}
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2"
        aria-label="Önceki Sayfa"
      >
        <ChevronLeft size={16} />
      </Button>

      {/* Pages list buttons */}
      <div className="flex items-center gap-1.5">
        {getPages().map((page, index) => {
          if (typeof page === "string") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 text-center text-slate-400 dark:text-slate-650 font-bold select-none text-xs"
              >
                {page}
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer",
                isActive
                  ? "bg-primary dark:bg-brand-500 text-white shadow-soft-sm"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-850 dark:hover:text-slate-200",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2"
        aria-label="Sonraki Sayfa"
      >
        <ChevronRight size={16} />
      </Button>
    </nav>
  );
};

export default Pagination;

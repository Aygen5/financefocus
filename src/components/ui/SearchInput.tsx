import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import Input, { InputProps } from "./Input";

export interface SearchInputProps extends Omit<InputProps, "leftIcon" | "rightIcon"> {
  onClear?: () => void;
  value: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, onChange, placeholder = "Ara...", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        leftIcon={<Search size={18} />}
        rightIcon={
          value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Aramayı temizle"
            >
              <X size={14} />
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;

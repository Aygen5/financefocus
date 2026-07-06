import React, { forwardRef, useId } from "react";
import { cn } from "@/utils/styles";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, error, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex flex-col text-left space-y-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            "inline-flex items-center gap-3 cursor-pointer text-sm font-semibold select-none",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <div className="relative flex items-center justify-center">
            <input
              id={checkboxId}
              type="checkbox"
              ref={ref}
              disabled={disabled}
              aria-invalid={!!error}
              className={cn(
                "peer shrink-0 h-5 w-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-primary dark:text-brand-500 focus:ring-2 focus:ring-primary dark:focus:ring-brand-500 focus:ring-offset-0 transition-all cursor-pointer appearance-none checked:bg-primary dark:checked:bg-brand-500 checked:border-transparent disabled:cursor-not-allowed",
                error && "border-red-500 focus:ring-red-500",
                className,
              )}
              {...props}
            />
            {/* Custom Checkmark Icon */}
            <svg
              className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 h-3.5 w-3.5 text-white stroke-current stroke-2 fill-none transition-opacity"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          {label && <span className="text-slate-700 dark:text-slate-200">{label}</span>}
        </label>

        {error && (
          <p id={`${checkboxId}-error`} className="text-xs font-bold text-red-500 pl-8">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;

import React, { forwardRef, useId } from "react";
import { cn } from "@/utils/styles";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = "", label, error, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    return (
      <div className="flex flex-col text-left space-y-1">
        <label
          htmlFor={switchId}
          className={cn(
            "inline-flex items-center gap-3 cursor-pointer text-sm font-semibold select-none",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <div className="relative flex items-center">
            <input
              id={switchId}
              type="checkbox"
              ref={ref}
              disabled={disabled}
              aria-invalid={!!error}
              className={cn("sr-only peer", className)}
              {...props}
            />
            {/* Custom Switch Track */}
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full transition-colors duration-200 peer-checked:bg-primary dark:peer-checked:bg-brand-500 peer-focus:outline-none disabled:cursor-not-allowed relative" />
            {/* Custom Switch Thumb */}
            <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-full shadow-sm" />
          </div>
          {label && <span className="text-slate-700 dark:text-slate-200">{label}</span>}
        </label>

        {error && (
          <p id={`${switchId}-error`} className="text-xs font-bold text-red-500 pl-[52px]">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";
export default Switch;

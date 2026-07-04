import React, { forwardRef, useId } from "react";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className = "", containerClassName = "", disabled = false, ...props }, ref) => {
    const internalId = useId();

    return (
      <div className={`flex items-center gap-3 text-left ${className} ${containerClassName}`}>
        <div className="relative inline-flex items-center">
          <input
            id={internalId}
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          {/* Track */}
          <div
            onClick={(e) => {
              if (disabled) return;
              const input = e.currentTarget.previousSibling as HTMLInputElement;
              input?.click();
            }}
            className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-brand-500 peer-checked:after:border-white cursor-pointer transition-all duration-200 disabled:pointer-events-none peer-disabled:opacity-50"
          ></div>
        </div>
        {label && (
          <label
            htmlFor={internalId}
            className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none leading-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;

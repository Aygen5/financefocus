import React, { forwardRef, useId } from "react";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = "", containerClassName = "", disabled = false, ...props }, ref) => {
    const internalId = useId();
    const errorId = `${internalId}-error`;

    const radioStyles = `
      h-4 w-4 rounded-full border-slate-300 dark:border-slate-800 text-brand-500 bg-white dark:bg-slate-900 focus:ring-brand-500/20 focus:ring-2 focus:ring-offset-0 transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50
      ${error ? "border-red-500 focus:ring-red-500/20" : ""}
    `;

    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        <div className="flex items-start gap-2.5">
          <input
            id={internalId}
            ref={ref}
            type="radio"
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            className={`${radioStyles} ${className}`}
            {...props}
          />
          {label && (
            <label
              htmlFor={internalId}
              className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none leading-none pt-0.5"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <span id={errorId} className="text-[12px] font-medium text-red-500 pl-6">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Radio.displayName = "Radio";

export default Radio;

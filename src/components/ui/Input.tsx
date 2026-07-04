import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      disabled = false,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const internalId = useId();
    const errorId = `${internalId}-error`;

    const inputStyles = `
      w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-normal py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:pointer-events-none disabled:bg-slate-50 dark:disabled:bg-slate-950/40 disabled:opacity-60
      ${leftIcon ? "pl-10" : "pl-4"}
      ${rightIcon ? "pr-10" : "pr-4"}
      ${
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
          : "border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-brand-500/20"
      }
    `;

    return (
      <div className={`flex flex-col gap-1.5 w-full text-left ${containerClassName}`}>
        {label && (
          <label
            htmlFor={internalId}
            className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none select-none">
              {leftIcon}
            </div>
          )}
          <input
            id={internalId}
            ref={ref}
            type={type}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            className={`${inputStyles} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 select-none">{rightIcon}</div>
          )}
        </div>
        {error && (
          <span id={errorId} className="text-[12px] font-medium text-red-500 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;

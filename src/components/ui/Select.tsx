import React, { forwardRef, useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      className = "",
      containerClassName = "",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const internalId = useId();
    const errorId = `${internalId}-error`;

    const selectStyles = `
      w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-normal px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:pointer-events-none disabled:bg-slate-50 dark:disabled:bg-slate-950/40 disabled:opacity-60 cursor-pointer appearance-none
      ${
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
          : "border-slate-200 dark:border-slate-800 focus:border-brand-500 focus:ring-brand-500/20"
      }
    `;

    return (
      <div className={`flex flex-col gap-1.5 w-full text-left relative ${containerClassName}`}>
        {label && (
          <label
            htmlFor={internalId}
            className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={internalId}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            className={`${selectStyles} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom Arrow Down Icon */}
          <div className="absolute right-4 text-slate-400 pointer-events-none select-none">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

Select.displayName = "Select";

export default Select;

import React, { forwardRef, useId } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", containerClassName = "", disabled = false, ...props }, ref) => {
    const internalId = useId();
    const errorId = `${internalId}-error`;

    const textareaStyles = `
      w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-normal px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:pointer-events-none disabled:bg-slate-50 dark:disabled:bg-slate-950/40 disabled:opacity-60 resize-none min-h-[100px]
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
        <textarea
          id={internalId}
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          className={`${textareaStyles} ${className}`}
          {...props}
        />
        {error && (
          <span id={errorId} className="text-[12px] font-medium text-red-500 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;

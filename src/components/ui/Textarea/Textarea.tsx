import React, { forwardRef, useId } from "react";
import { cn } from "@/utils/styles";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, helperText, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-bold text-slate-500 dark:text-slate-400 select-none uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          className={cn(
            "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-brand-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none h-24",
            error &&
              "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500",
            className,
          )}
          {...props}
        />

        {error && (
          <p id={`${textareaId}-error`} className="text-xs font-bold text-red-500 select-none">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${textareaId}-helper`}
            className="text-xs font-medium text-slate-400 dark:text-slate-500 select-none"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;

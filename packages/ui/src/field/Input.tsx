import { cn } from "cn";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";

export type TInputSize = "xs" | "sm" | "md" | "lg";

export interface IInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  ref?: Ref<HTMLInputElement>;
  size?: TInputSize;
  hasError?: boolean;
  suffix?: ReactNode;
}

const inputSizeClasses: Record<TInputSize, string> = {
  xs: "rounded-lg bg-louve-surface px-2 py-1 text-xs",
  sm: "w-full rounded-xl bg-louve-bg px-3.5 py-1.5 text-xs focus:bg-louve-surface",
  md: "w-full rounded-xl bg-louve-bg px-3.5 py-2 text-sm focus:bg-louve-surface",
  lg: "w-full rounded-xl bg-louve-bg px-3.5 py-2.5 text-sm focus:bg-louve-surface",
};

export function Input(props: IInputProps) {
  const { size, hasError, suffix, className, ...inputProps } = props;

  const inputElement = (
    <input
      {...inputProps}
      className={cn(
        "border font-medium text-louve-navy outline-none transition-colors placeholder:font-normal placeholder:text-louve-slate-muted disabled:cursor-not-allowed disabled:opacity-60",
        inputSizeClasses[size ?? "lg"],
        hasError
          ? "border-danger-400 bg-danger-50/30 focus:border-danger-500"
          : "border-louve-border-strong focus:border-louve-blue",
        className,
      )}
    />
  );

  if (!suffix) {
    return inputElement;
  }

  return (
    <div className="relative">
      {inputElement}
      <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 font-medium text-louve-slate text-xs">
        {suffix}
      </span>
    </div>
  );
}

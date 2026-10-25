import { cn } from "cn";
import type { ReactNode } from "react";
import { AlertCircle } from "react-feather";
import { FieldLabel } from "./FieldLabel";

export interface IFormFieldWrapperProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  errorMessage?: string;
  children: ReactNode;
  childrenAfterInput?: ReactNode;
  className?: string;
}

export function FormFieldWrapper(props: IFormFieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", props.className)}>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={props.htmlFor}>
          {props.label}
          {props.required && <span className="ml-1 text-danger-500">*</span>}
        </FieldLabel>
        {props.description && <span className="text-louve-slate text-[11px]">{props.description}</span>}
      </div>

      {props.children}

      {props.childrenAfterInput}

      {props.errorMessage && (
        <p className="flex items-center gap-1.5 font-medium text-[11px] text-danger-600" role="alert">
          <AlertCircle size={12} className="shrink-0" />
          <span>{props.errorMessage}</span>
        </p>
      )}
    </div>
  );
}

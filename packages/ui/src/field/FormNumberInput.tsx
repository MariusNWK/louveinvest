"use client";

import { type FieldValues, type TFieldName, useController } from "form/interfaces";
import type { ReactNode } from "react";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { Input } from "./Input";

export interface IFormNumberInputProps<TFieldValues extends FieldValues> {
  name: TFieldName<TFieldValues>;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  suffix?: string;
  min?: number;
  step?: number;
  disabled?: boolean;
  childrenAfterInput?: ReactNode;
  className?: string;
}

export function FormNumberInput<TFieldValues extends FieldValues>(props: IFormNumberInputProps<TFieldValues>) {
  const controller = useController({
    name: props.name,
  });

  const field = controller.field;
  const errorMessage = controller.fieldState.error?.message;
  const inputId = `field-${String(props.name)}`;
  const numericValue = typeof field.value === "number" && !Number.isNaN(field.value) ? field.value : "";

  return (
    <FormFieldWrapper
      label={props.label}
      htmlFor={inputId}
      required={props.required}
      description={props.description}
      errorMessage={errorMessage}
      childrenAfterInput={props.childrenAfterInput}
      className={props.className}
    >
      <Input
        id={inputId}
        type="number"
        name={field.name}
        ref={field.ref}
        min={props.min}
        step={props.step}
        value={numericValue}
        disabled={props.disabled}
        placeholder={props.placeholder}
        onBlur={field.onBlur}
        onWheel={(event) => event.currentTarget.blur()}
        onChange={(event) => {
          const rawValue = event.target.value;
          if (rawValue === "") {
            field.onChange(Number.NaN);
            return;
          }
          const parsedNumber = Number.parseFloat(rawValue);
          field.onChange(parsedNumber);
        }}
        hasError={Boolean(errorMessage)}
        suffix={props.suffix}
        className={props.suffix ? "pr-20" : undefined}
      />
    </FormFieldWrapper>
  );
}

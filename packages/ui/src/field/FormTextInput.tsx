"use client";

import { type FieldValues, type TFieldName, useController } from "form/interfaces";
import type { ReactNode } from "react";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { Input } from "./Input";

export interface IFormTextInputProps<TFieldValues extends FieldValues> {
  name: TFieldName<TFieldValues>;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
  autoComplete?: string;
  childrenAfterInput?: ReactNode;
  className?: string;
}

export function FormTextInput<TFieldValues extends FieldValues>(props: IFormTextInputProps<TFieldValues>) {
  const controller = useController({
    name: props.name,
  });

  const field = controller.field;
  const errorMessage = controller.fieldState.error?.message;
  const inputId = `field-${String(props.name)}`;

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
        type="text"
        name={field.name}
        ref={field.ref}
        value={typeof field.value === "string" ? field.value : ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={props.disabled}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete ?? "off"}
        hasError={Boolean(errorMessage)}
      />
    </FormFieldWrapper>
  );
}

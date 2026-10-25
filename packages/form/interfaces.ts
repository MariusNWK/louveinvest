"use client";

import type {
  ControllerRenderProps,
  DefaultValues,
  FieldErrors,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

import { FormProvider, useController, useFieldArray, useFormContext, useFormState, useWatch } from "react-hook-form";

export { FormProvider, useController, useFieldArray, useFormContext, useFormState, useWatch };
export type { ControllerRenderProps, DefaultValues, FieldErrors, FieldValues, UseFormReturn };

export type TFieldName<TFieldValues extends FieldValues> = Path<TFieldValues>;

"use client";

import { useContext } from "react";
import { type ISnackbarContextValue, snackbarContext } from "../app/SnackbarContext";

export function useSnackbar(): ISnackbarContextValue {
  return useContext(snackbarContext);
}

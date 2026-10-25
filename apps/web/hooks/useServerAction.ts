"use client";

import { ERROR_OCCURRED } from "my-variables";
import type { TResult, TResultSuccess } from "my-zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useSnackbar } from "./useSnackbar";

type TActionCallback<T> = () => Promise<TResult<T>>;

export interface IUseServerActionReturn<T> {
  isPending: boolean;
  action: (callback: TActionCallback<T>, afterSubmit?: (result: TResultSuccess<T>) => void) => void;
}

export function useServerAction<T = unknown>(): IUseServerActionReturn<T> {
  const [isPending, startTransition] = useTransition();
  const snackbar = useSnackbar();
  const router = useRouter();

  function action(callback: TActionCallback<T>, afterSubmit?: (result: TResultSuccess<T>) => void): void {
    startTransition(async () => {
      try {
        const result = await callback();

        if (result?.error) {
          snackbar.error(result.error);
          if (result.redirectTo) {
            router.push(result.redirectTo);
          }
        }

        if (result?.success) {
          snackbar.success(result.success);
          if (afterSubmit) {
            afterSubmit(result);
          }
          if (result.redirectTo) {
            router.push(result.redirectTo);
          }
        }
      } catch {
        snackbar.error(ERROR_OCCURRED);
      }
    });
  }

  return {
    isPending,
    action,
  };
}

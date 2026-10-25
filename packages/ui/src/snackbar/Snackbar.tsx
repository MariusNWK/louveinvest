"use client";

import { cn } from "cn";
import type { TSnackbarType } from "my-zod";
import { useEffect } from "react";
import { AlertCircle, CheckCircle, Info, X } from "react-feather";
import { Button } from "../button/Button";

export interface ISnackbarProps {
  text: string;
  type: TSnackbarType;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export function Snackbar(props: ISnackbarProps) {
  const isVisible = props.isVisible;
  const setIsVisible = props.setIsVisible;

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isVisible, setIsVisible]);

  let containerStyle = "border-success-200 bg-success-50 text-success-900";
  let iconElement = <CheckCircle size={16} className="shrink-0 text-success-600" />;

  if (props.type === "error") {
    containerStyle = "border-error-200 bg-error-50 text-error-900";
    iconElement = <AlertCircle size={16} className="shrink-0 text-error-600" />;
  } else if (props.type === "info") {
    containerStyle = "border-louve-blue-border bg-louve-blue-soft text-louve-navy";
    iconElement = <Info size={16} className="shrink-0 text-louve-blue" />;
  }

  return (
    <div
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 mx-auto flex max-w-md justify-center px-4 transition-all duration-200 ease-out",
        isVisible ? "top-4 opacity-100" : "-top-16 opacity-0",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-md",
          containerStyle,
        )}
      >
        <div className="flex items-center gap-2.5">
          {iconElement}
          <p className="whitespace-pre-line font-medium text-xs">{isVisible ? props.text : ""}</p>
        </div>
        <Button variant="icon" onClick={() => setIsVisible(false)} ariaLabel="Fermer la notification">
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}

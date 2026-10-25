"use client";

import type { TSnackbarType } from "my-zod";
import { createContext, type ReactNode, useCallback, useMemo, useState } from "react";
import { Snackbar } from "ui";

export interface ISnackbarContextValue {
  success: (value: string) => void;
  error: (value: string) => void;
  info: (value: string) => void;
}

export const snackbarContext = createContext<ISnackbarContextValue>({
  success: (_value: string) => {},
  error: (_value: string) => {},
  info: (_value: string) => {},
});

export interface ISnackbarContextProps {
  children: ReactNode;
}

export function SnackbarContext(props: ISnackbarContextProps) {
  const [type, setType] = useState<TSnackbarType>("success");
  const [text, setText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = useCallback((value: string) => {
    setText(value);
    setIsVisible(true);
  }, []);

  const success = useCallback(
    (value: string) => {
      setType("success");
      show(value);
    },
    [show],
  );

  const error = useCallback(
    (value: string) => {
      setType("error");
      show(value);
    },
    [show],
  );

  const info = useCallback(
    (value: string) => {
      setType("info");
      show(value);
    },
    [show],
  );

  const contextValue = useMemo(
    () => ({
      success,
      error,
      info,
    }),
    [success, error, info],
  );

  return (
    <snackbarContext.Provider value={contextValue}>
      {props.children}
      <Snackbar type={type} text={text} isVisible={isVisible} setIsVisible={setIsVisible} />
    </snackbarContext.Provider>
  );
}

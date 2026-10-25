import type { ReactNode } from "react";

export interface IContainerProps {
  children: ReactNode;
}

export function Container(props: IContainerProps) {
  return <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6 md:p-8">{props.children}</main>;
}

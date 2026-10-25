"use client";

import type { ILinkProps } from "my-zod";
import NextLink from "next/link";

export function Link(props: ILinkProps) {
  return (
    <NextLink href={props.href} className={props.className} id={props.id} target={props.target}>
      {props.children}
    </NextLink>
  );
}
